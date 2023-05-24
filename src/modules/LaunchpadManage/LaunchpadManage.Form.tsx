/* eslint-disable react/no-children-prop */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import ModalConfirmApprove from '@/components/ModalConfirmApprove';
import SocialToken from '@/components/Social';
import { transactionType } from '@/components/Swap/alertInfoProcessing/types';
import FiledButton from '@/components/Swap/button/filedButton';
import FieldAmount from '@/components/Swap/form/fieldAmount';
import FieldDate from '@/components/Swap/form/fieldDate';
import FieldSelect from '@/components/Swap/form/fieldDropdown';
import FieldMDEditor from '@/components/Swap/form/fieldMDEditor';
import HorizontalItem from '@/components/Swap/horizontalItem';
import WrapperConnected from '@/components/WrapperConnected';
import { LAUNCHPAD_FACTORY_ADDRESS } from '@/configs';
import { TOKEN_ICON_DEFAULT } from '@/constants/common';
import { toastError } from '@/constants/error';
import { ROUTE_PATH } from '@/constants/route-path';
import useApproveERC20Token from '@/hooks/contract-operations/token/useApproveERC20Token';
import useBalanceERC20Token from '@/hooks/contract-operations/token/useBalanceERC20Token';
import useIsApproveERC20Token from '@/hooks/contract-operations/token/useIsApproveERC20Token';
import { IToken } from '@/interfaces/token';
import { TransactionStatus } from '@/interfaces/walletTransaction';
import { getListLiquidityToken, getListOwnerToken } from '@/services/launchpad';
import { logErrorToServer } from '@/services/swap';
import { closeModal, openModal } from '@/state/modal';
import { updateCurrentTransaction } from '@/state/pnftExchange';
import { colors } from '@/theme/colors';
import { formatCurrency } from '@/utils';
import { composeValidators, required, requiredAmount } from '@/utils/formValidate';
import { showError } from '@/utils/toast';
import { Box, Flex, FormLabel, Text } from '@chakra-ui/react';
import { px2rem } from '@trustless-computer/dapp-core';
import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import { isEmpty, truncate } from 'lodash';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { Field, useForm, useFormState } from 'react-final-form';
import { useDispatch } from 'react-redux';
import web3 from 'web3';

interface IdoTokenManageFormProps {
  handleSubmit?: (_: any) => void;
  setLoading: (_: any) => void;
  loading?: boolean;
  detail?: any;
  isRemove?: boolean;
}

const IdoTokenManageForm: React.FC<IdoTokenManageFormProps> = ({
  handleSubmit,
  loading,
  detail,
  isRemove,
  setLoading,
}) => {
  const router = useRouter();

  const [tokens, setTokens] = useState<IToken[]>([]);
  const [liquidTokens, setLiquidTokens] = useState<IToken[]>([]);
  const { account, isActive } = useWeb3React();
  const dispatch = useDispatch();

  const [isApproveToken, setIsApproveToken] = useState<boolean>(true);
  const [isApproveAmountToken, setIsApproveAmountToken] = useState<string>('0');
  const [balanceToken, setBalanceToken] = useState<string>('0');

  const { values, submitting } = useFormState();
  const { change } = useForm();
  const { call: isApproved } = useIsApproveERC20Token();
  const { call: approveToken } = useApproveERC20Token();
  const { call: tokenBalance } = useBalanceERC20Token();

  const tokenSelected: IToken | undefined = values?.launchpadTokenArg;

  useEffect(() => {
    if (detail) {
      change('id', detail.id);
      change('token', detail.token);
      change('price', detail.price);
      change('start_at', new Date(detail.startAt));
    }
  }, [detail]);

  useEffect(() => {
    getTokens();
  }, [isActive, account]);

  useEffect(() => {
    if (tokenSelected) {
      checkTokenApprove(tokenSelected);
    }
  }, [tokenSelected]);

  useEffect(() => {
    if (tokenSelected && Number(values?.launchpadBalance) > 0) {
      setIsApproveToken(
        checkBalanceIsApprove(isApproveAmountToken, values?.launchpadBalance),
      );
    }
  }, [values?.launchpadBalance, tokenSelected]);

  const checkBalanceIsApprove = (required: any = 0, amount: any = 0) => {
    return required > 0 && new BigNumber(required).minus(amount).toNumber() >= 0;
  };

  const checkTokenApprove = async (token: IToken | any) => {
    try {
      const [_isApprove, _tokenBalance] = await Promise.all([
        isApproved({
          erc20TokenAddress: token.address,
          address: LAUNCHPAD_FACTORY_ADDRESS,
        }),
        tokenBalance({
          erc20TokenAddress: token.address,
        }),
      ]);
      setIsApproveAmountToken(web3.utils.fromWei(_isApprove));
      setBalanceToken(_tokenBalance);
      return _isApprove;
    } catch (error) {
      console.log('error', error);
      throw error;
    }
  };

  const getTokens = async () => {
    setTokens([]);
    if (!account || !isActive) {
      return;
    }
    try {
      const response = await Promise.all([
        getListOwnerToken({
          address: account,
          page: 1,
          limit: 9999,
        }),
        getListLiquidityToken(),
      ]);

      setTokens(response[0]);
      setLiquidTokens(response[1]);
    } catch (error) {
      console.log('error', error);
    }
  };

  const validateAmount = useCallback(
    (_amount: any) => {
      if (Number(_amount) > Number(balanceToken)) {
        return `Max amount is ${formatCurrency(balanceToken)}`;
      }

      return undefined;
    },
    [values.launchpadBalance, tokenSelected, balanceToken],
  );

  const validateMaxRatio = useCallback(
    (_amount: any) => {
      if (Number(_amount) > Number(90)) {
        return `Max ratio is ${90}%`;
      }

      return undefined;
    },
    [values.launchpadBalance, tokenSelected],
  );

  const requestApproveToken = async (
    token: IToken | any,
    approveContract: string = LAUNCHPAD_FACTORY_ADDRESS,
  ) => {
    try {
      dispatch(
        updateCurrentTransaction({
          id: transactionType.idoManage,
          status: TransactionStatus.info,
        }),
      );

      const response: any = await approveToken({
        erc20TokenAddress: token.address,
        address: approveContract,
      });
      dispatch(
        updateCurrentTransaction({
          status: TransactionStatus.success,
          id: transactionType.createPoolApprove,
          hash: response.hash,
          infoTexts: {
            success: `${token?.symbol} has been approved successfully.`,
          },
        }),
      );
    } catch (error) {
      throw error;
    } finally {
    }
  };

  const onApprove = async () => {
    try {
      setLoading(true);

      await requestApproveToken({
        address: tokenSelected?.address,
      });
      const _isApprove = await checkTokenApprove({
        address: tokenSelected?.address,
      });
      setIsApproveToken(
        checkBalanceIsApprove(web3.utils.fromWei(_isApprove), values?.liquidValue),
      );

      // toast.success('Transaction has been created. Please wait for few minutes.');
    } catch (err) {
      const message =
        (err as Error).message || 'Something went wrong. Please try again later.';
      logErrorToServer({
        type: 'error',
        address: account,
        error: JSON.stringify(err),
        message: message,
      });
      toastError(showError, err, { address: account });
      dispatch(updateCurrentTransaction(null));
    } finally {
      setLoading(false);
    }
  };

  const onShowModalApprove = () => {
    const id = 'modal';
    const onClose = () => dispatch(closeModal({ id }));
    dispatch(
      openModal({
        id,
        theme: 'dark',
        title: `APPROVE USE OF ${!tokenSelected?.symbol}`,
        modalProps: {
          centered: true,
          // size: mobileScreen ? 'full' : 'xl',
          zIndex: 9999999,
        },
        render: () => (
          <ModalConfirmApprove onApprove={onApprove} onClose={onClose} />
        ),
      }),
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box className="form-container">
        <Flex flexDirection={['column', 'column', 'column', 'row']} gap={8}>
          <Flex flexDirection={'column'} justifyContent={'space-between'} flex={1}>
            <Box>
              <Flex gap={6} flexDirection={['column', 'column', 'row']}>
                <Box flex={1}>
                  <FormLabel fontSize="xs" fontWeight="medium">
                    Token
                  </FormLabel>
                  <Field
                    name="launchpadTokenArg"
                    options={tokens}
                    children={FieldSelect}
                    validate={required}
                    disabled={detail || isRemove}
                  />
                </Box>
                <Box flex={1}>
                  <FormLabel fontSize="xs" fontWeight="medium">
                    Liquidity
                  </FormLabel>
                  <Field
                    name="liquidityTokenArg"
                    options={liquidTokens}
                    children={FieldSelect}
                    validate={required}
                    disabled={detail || isRemove}
                  />
                </Box>
              </Flex>

              <Box mb={6} />
              <Flex gap={6} flexDirection={['column', 'column', 'column']}>
                <Field
                  name="launchpadBalance"
                  decimals={18}
                  children={FieldAmount}
                  label={`Balance ${
                    tokenSelected ? `(${tokenSelected.symbol})` : ''
                  }`}
                  disabled={isRemove}
                  validate={composeValidators(requiredAmount, validateAmount)}
                  rightLabel={
                    !isEmpty(tokenSelected) && (
                      <Flex
                        alignItems={'center'}
                        gap={2}
                        fontSize={px2rem(14)}
                        color={'#FFFFFF'}
                        mb={2}
                      >
                        <Flex gap={1} alignItems={'center'}>
                          Balance: {formatCurrency(balanceToken)}
                        </Flex>
                        <Text
                          cursor={'pointer'}
                          color={'#3385FF'}
                          onClick={() => change('launchpadBalance', balanceToken)}
                          bgColor={'rgba(51, 133, 255, 0.2)'}
                          borderRadius={'4px'}
                          padding={'1px 12px'}
                        >
                          MAX
                        </Text>
                      </Flex>
                    )
                  }
                />
                <Field
                  name="liquidityRatioArg"
                  decimals={18}
                  children={FieldAmount}
                  label={`Ratio (%)`}
                  disabled={isRemove}
                  validate={composeValidators(requiredAmount, validateMaxRatio)}
                />
              </Flex>

              <Box mb={6} />
              <Flex gap={6} flexDirection={['column', 'column', 'row']}>
                <Box flex={1}>
                  <Field
                    validate={required}
                    name="startTimeArg"
                    children={FieldDate}
                    label="Start Date"
                    disabled={isRemove}
                  />
                </Box>
                <Box flex={1}>
                  <Field
                    validate={required}
                    name="endTimeArg"
                    children={FieldDate}
                    label="End Date"
                    disabled={isRemove}
                  />
                </Box>
              </Flex>
              <Box mb={6} />
            </Box>
          </Flex>
          <Box className="token-info" flex={1}>
            <Text as={'h6'}>Token information</Text>
            {tokenSelected && (
              <Flex
                justifyContent={'space-between'}
                flexDirection={'column'}
                height={'100%'}
              >
                <Box>
                  <img
                    src={tokenSelected?.thumbnail || TOKEN_ICON_DEFAULT}
                    alt="token-avatar"
                  />

                  <Box>
                    <SocialToken theme="dark" socials={tokenSelected.social} />
                  </Box>

                  <Box mt={6} />
                  <HorizontalItem
                    className="horizontal-item"
                    label={'Name'}
                    value={tokenSelected?.name}
                  />
                  <Box mt={3} />
                  <HorizontalItem
                    className="horizontal-item"
                    label={'Symbol'}
                    value={tokenSelected?.symbol}
                  />
                  <Box mt={3} />
                  <HorizontalItem
                    label={'Total Supply'}
                    className="horizontal-item"
                    value={formatCurrency(
                      web3.utils.fromWei(tokenSelected?.totalSupply),
                    )}
                  />
                  <Box mt={3} />
                  <HorizontalItem
                    className="horizontal-item"
                    label={'Description'}
                    value={truncate(tokenSelected?.description, {
                      length: 50,
                      separator: '...',
                    })}
                  />
                </Box>

                <Box>
                  <Box mt={6} />
                  <FiledButton
                    btnSize="l"
                    variant={'outline'}
                    className="btn-update-info"
                    onClick={() => {
                      router.push(
                        `${ROUTE_PATH.UPDATE_TOKEN_INFO}?address=${tokenSelected?.address}`,
                      );
                    }}
                  >
                    Update token info
                  </FiledButton>
                </Box>
              </Flex>
            )}
          </Box>
        </Flex>
        <Field
          validate={required}
          name="description"
          children={FieldMDEditor}
          label="Description"
          disabled={isRemove}
        />
        <Box mt={6} />
        <Field
          validate={required}
          name="faqs"
          children={FieldMDEditor}
          label="Faqs"
          disabled={isRemove}
        />
        <Box mt={6} />
        <WrapperConnected
          type={isApproveToken ? 'button' : 'submit'}
          className="btn-submit"
        >
          {!isApproveToken && tokenSelected ? (
            <FiledButton
              isLoading={loading}
              isDisabled={loading}
              loadingText="Processing"
              btnSize={'h'}
              onClick={onShowModalApprove}
              type="button"
              processInfo={{
                id: transactionType.idoManage,
              }}
            >
              {`APPROVE USE OF ${tokenSelected?.symbol}`}
            </FiledButton>
          ) : (
            <FiledButton
              isLoading={loading}
              isDisabled={loading}
              type="submit"
              style={{
                backgroundColor: isRemove ? colors.redPrimary : colors.bluePrimary,
              }}
              processInfo={{
                id: transactionType.createLaunchpad,
              }}
              btnSize="h"
            >
              {isRemove ? 'Remove' : detail ? 'Update' : 'Submit'}
            </FiledButton>
          )}
        </WrapperConnected>
      </Box>
    </form>
  );
};

export default IdoTokenManageForm;
