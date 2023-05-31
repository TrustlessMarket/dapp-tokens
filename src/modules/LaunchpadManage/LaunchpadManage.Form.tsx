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
import FieldText from '@/components/Swap/form/fieldText';
import FileDropzoneUpload from '@/components/Swap/form/fileDropzoneUpload';
import InputWrapper from '@/components/Swap/form/inputWrapper';
import HorizontalItem from '@/components/Swap/horizontalItem';
import WrapperConnected from '@/components/WrapperConnected';
import { LAUNCHPAD_FACTORY_ADDRESS } from '@/configs';
import { TOKEN_ICON_DEFAULT } from '@/constants/common';
import { toastError } from '@/constants/error';
import { ROUTE_PATH } from '@/constants/route-path';
import useGetConfigLaunchpad, {
  ConfigLaunchpadResponse,
} from '@/hooks/contract-operations/launchpad/useGetConfigLaunchpad';
import useApproveERC20Token from '@/hooks/contract-operations/token/useApproveERC20Token';
import useBalanceERC20Token from '@/hooks/contract-operations/token/useBalanceERC20Token';
import useIsApproveERC20Token from '@/hooks/contract-operations/token/useIsApproveERC20Token';
import { ILaunchpad } from '@/interfaces/launchpad';
import { IToken } from '@/interfaces/token';
import { TransactionStatus } from '@/interfaces/walletTransaction';
import { uploadFile } from '@/services/file';
import { getListLiquidityToken, getListOwnerToken } from '@/services/launchpad';
import { logErrorToServer } from '@/services/swap';
import { closeModal, openModal } from '@/state/modal';
import { updateCurrentTransaction } from '@/state/pnftExchange';
import { colors } from '@/theme/colors';
import { formatCurrency, getLiquidityRatio } from '@/utils';
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
import { BiPlus } from 'react-icons/bi';
import { IoRemoveCircle } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import web3 from 'web3';
import { MAX_FILE_SIZE } from '../UpdateTokenInfo/form';
import InfoTooltip from '@/components/Swap/infoTooltip';
import moment from 'moment';
import useTCWallet from '@/hooks/useTCWallet';

interface IdoTokenManageFormProps {
  handleSubmit?: (_: any) => void;
  setLoading: (_: any) => void;
  loading?: boolean;
  detail?: ILaunchpad;
}

const defaultFaqs = [
  {
    id: 1,
  },
];

const IdoTokenManageForm: React.FC<IdoTokenManageFormProps> = ({
  handleSubmit,
  loading,
  detail,
  setLoading,
}) => {
  const router = useRouter();

  const [tokens, setTokens] = useState<IToken[]>([]);
  const [liquidTokens, setLiquidTokens] = useState<IToken[]>([]);
  const [launchpadConfigs, setLaunchpadConfigs] = useState<
    ConfigLaunchpadResponse | any
  >({});

  const { tcWalletAddress: account, isAuthenticated: isActive } = useTCWallet();
  const dispatch = useDispatch();

  const [isApproveToken, setIsApproveToken] = useState<boolean>(true);
  const [isApproveAmountToken, setIsApproveAmountToken] = useState<string>('0');
  const [balanceToken, setBalanceToken] = useState<string>('0');
  const [uploading, setUploading] = useState(false);
  const [faqs, setFaqs] = useState<any[]>(defaultFaqs);
  const [needLiquidBalance, setNeedLiquidBalance] = useState<string>('0');

  const { values } = useFormState();
  const { change, initialize } = useForm();
  const { call: isApproved } = useIsApproveERC20Token();
  const { call: approveToken } = useApproveERC20Token();
  const { call: tokenBalance } = useBalanceERC20Token();
  const { call: getConfigLaunchpad } = useGetConfigLaunchpad();

  const tokenSelected: IToken | undefined = values?.launchpadTokenArg;
  const liquidityTokenSelected: IToken | undefined = values?.liquidityTokenArg;

  useEffect(() => {
    if (detail) {
      setFaqs(JSON.parse(detail.qandA).map((v: any, i: number) => ({ id: i + 1 })));
      const _faqs: any = {};
      for (let i = 0; i < JSON.parse(detail.qandA).length; i++) {
        const element = JSON.parse(detail.qandA)[i];
        _faqs[`faq_q_${i + 1}`] = element.value;
        _faqs[`faq_a_${i + 1}`] = element.label;
      }
      initialize({
        launchpadTokenArg: detail.launchpadToken,
        liquidityTokenArg: detail.liquidityToken,
        launchpadBalance: detail.launchpadBalance,
        liquidityRatioArg: detail.liquidityRatio,
        goalBalance: detail.goalBalance,
        startTimeArg: new Date(detail.startTime),
        endTimeArg: new Date(detail.endTime),
        description: detail.description,
        video: detail.video,
        image: detail.image,
        duration: detail.duration,
        ..._faqs,
      });
    }
  }, [detail]);

  useEffect(() => {
    getTokens();
  }, [isActive, account]);

  useEffect(() => {
    if (tokenSelected) {
      checkTokenApprove(tokenSelected);
    }
  }, [JSON.stringify(tokenSelected), detail, values?.launchpadBalance]);

  useEffect(() => {
    if (tokenSelected && Number(values?.launchpadBalance) > 0) {
      setIsApproveToken(
        checkBalanceIsApprove(isApproveAmountToken, values?.launchpadBalance),
      );
    }
  }, [values?.launchpadBalance, tokenSelected, isApproveAmountToken]);

  useEffect(() => {
    const multiX = new BigNumber(launchpadConfigs.liquidityPriceMultiple)
      .dividedBy(1000000)
      .toString();
    const launchpadBalance = values?.launchpadBalance || 0;
    const liquidityRatio = values?.liquidityRatioArg || 0;

    const _needLiquidBalance = new BigNumber(liquidityRatio)
      .dividedBy(100)
      .multipliedBy(launchpadBalance)
      .dividedBy(multiX)
      .toString();
    change('liquidityBalance', _needLiquidBalance);
    setNeedLiquidBalance(_needLiquidBalance);
  }, [
    values?.launchpadBalance,
    values?.liquidityRatioArg,
    launchpadConfigs.liquidityPriceMultiple,
  ]);

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
        getConfigLaunchpad({}),
      ]);

      setTokens(response[0]);
      setLiquidTokens(response[1]);
      setLaunchpadConfigs(response[2]);
    } catch (error) {
      console.log('error', error);
    }
  };

  const validateAmount = useCallback(
    (_amount: any) => {
      if (!detail && Number(_amount) > Number(balanceToken)) {
        return `Max amount is ${formatCurrency(balanceToken)}`;
      }

      return undefined;
    },
    [values.launchpadBalance, tokenSelected, balanceToken, detail],
  );

  const validateMaxRatio = useCallback(
    (_amount: any) => {
      if (!detail || !detail.launchpad) {
        if (Number(_amount) > Number(90)) {
          return `Max liquidity reserve is ${90}%`;
        } else if (
          new BigNumber(needLiquidBalance)
            .plus(values.launchpadBalance)
            .gt(balanceToken)
        ) {
          return `Liquidity balance is ${formatCurrency(
            new BigNumber(balanceToken).minus(values.launchpadBalance).toString(),
          )} ${tokenSelected?.symbol || ''}`;
        }
      }

      return undefined;
    },
    [values.launchpadBalance, tokenSelected, detail, needLiquidBalance],
  );

  const validateYoutubeLink = useCallback(
    (_link: any) => {
      if (!_link && !values.image) {
        return `Image or Youtube link is Required`;
      }

      return undefined;
    },
    [values.image],
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

  const onFileChange = async (file: File) => {
    // setFile(file);

    if (!file) {
      change('image', file);
    }

    try {
      setUploading(true);
      if (file) {
        const res = await uploadFile({ file: file });
        change('image', res?.url);
      }
    } catch (err) {
      const message =
        (err as Error).message || 'Something went wrong. Please try again later.';
      logErrorToServer({
        type: 'error',
        address: account,
        error: JSON.stringify(err),
        message: message,
      });
    } finally {
      setUploading(false);
    }
  };

  const onAddChoice = () => {
    setFaqs((value) => [
      ...value,
      {
        id: value.length + 1,
      },
    ]);
  };

  const onRemoveChoose = (i: any) => {
    setFaqs((value: any[]) => value.filter((v) => v.id !== i.id));
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
                    disabled={detail}
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
                    disabled={detail?.launchpad}
                  />
                </Box>
              </Flex>

              <Box mb={6} />
              <Flex gap={6} flexDirection={['column', 'column', 'column']}>
                <Field
                  name="launchpadBalance"
                  decimals={18}
                  children={FieldAmount}
                  label={`Rewards ${
                    tokenSelected ? `(${tokenSelected.symbol})` : ''
                  }`}
                  disabled={detail?.launchpad}
                  validate={composeValidators(requiredAmount, validateAmount)}
                  rightLabel={
                    !isEmpty(tokenSelected) &&
                    !detail && (
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
                  rightLabel={
                    !isEmpty(tokenSelected) &&
                    !detail && (
                      <Flex
                        alignItems={'center'}
                        gap={2}
                        fontSize={px2rem(14)}
                        color={'#FFFFFF'}
                        mb={2}
                      >
                        <Flex gap={1} alignItems={'center'}>
                          Liquidity balance: {formatCurrency(needLiquidBalance)}{' '}
                          {tokenSelected ? `${tokenSelected.symbol}` : ''}
                        </Flex>
                      </Flex>
                    )
                  }
                  label={
                    <InfoTooltip
                      showIcon={true}
                      label="Liquidity Reserve refers to a percentage of the funds that are used to add initial liquidity for trading purposes after the crowdfunding ends"
                      iconColor={colors.white500}
                    >
                      Liquidity reserve
                    </InfoTooltip>
                  }
                  disabled={detail?.launchpad}
                  validate={composeValidators(requiredAmount, validateMaxRatio)}
                />
              </Flex>
              <Box mb={6} />
              <Field
                name="goalBalance"
                decimals={18}
                children={FieldAmount}
                label={`Funding goal ${
                  liquidityTokenSelected ? `(${liquidityTokenSelected.symbol})` : ''
                }`}
                disabled={detail?.launchpad}
                validate={composeValidators(requiredAmount, validateMaxRatio)}
              />

              <Box mb={6} />
              <Field
                name="duration"
                decimals={18}
                children={FieldAmount}
                label={`Duration`}
                validate={composeValidators(requiredAmount, validateMaxRatio)}
              />
              {/* <Flex gap={6} flexDirection={['column', 'column', 'row']}>
                <Box flex={1}>
                  <Field
                    validate={required}
                    name="startTimeArg"
                    children={FieldDate}
                    label="Start Date"
                    disabled={detail}
                    minDate={new Date(moment().format())}
                    maxDate={
                      values?.endTimeArg
                        ? new Date(moment(values?.endTimeArg).format())
                        : undefined
                    }
                  />
                </Box>
                <Box flex={1}>
                  <Field
                    validate={required}
                    name="endTimeArg"
                    children={FieldDate}
                    label="End Date"
                    disabled={detail}
                    minDate={
                      values?.startTimeArg
                        ? new Date(moment(values?.startTimeArg).format())
                        : new Date(moment().format())
                    }
                  />
                </Box>
              </Flex> */}
              <Box mb={6} />
            </Box>
          </Flex>
          <Box className="token-info" flex={1}>
            <Text as={'h6'}>Token information's</Text>
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
        <Box mt={6} />
        <InputWrapper theme="dark" label={<Text>Image</Text>}>
          <FileDropzoneUpload
            className="image-drop-container"
            accept="image/*"
            maxSize={MAX_FILE_SIZE}
            onChange={onFileChange}
            url={values?.image}
            loading={uploading}
          />
        </InputWrapper>
        <Box mt={6} />
        <Field
          validate={composeValidators(validateYoutubeLink, validateYoutubeLink)}
          name="video"
          children={FieldText}
          label="Youtube link"
        />
        <Box mt={6} />
        <Field
          validate={required}
          name="description"
          children={FieldMDEditor}
          label="Description"
        />
        <Box mt={6} />
        <InputWrapper theme="dark" label={<Text>Faqs</Text>}>
          {faqs.map((v, i) => (
            <Flex alignItems={'center'} gap={6} key={i}>
              <InputWrapper
                className="item-faq-container"
                key={`q-${i}`}
                label={`Q. ${v.id}`}
                theme="dark"
              >
                <Field
                  name={`faq_q_${v.id}`}
                  placeholder="Question"
                  children={FieldText}
                  validate={required}
                />
              </InputWrapper>
              <InputWrapper
                className="item-faq-container"
                key={`a${i}`}
                label={`A. ${v.id}`}
                theme="dark"
              >
                <Field
                  name={`faq_a_${v.id}`}
                  placeholder="Answer"
                  children={FieldText}
                  validate={required}
                />
              </InputWrapper>
              {i > 0 ? (
                <Box
                  onClick={() => onRemoveChoose(v)}
                  // className={styles.btnRemoveChoose}
                  color={colors.redPrimary}
                  cursor={'pointer'}
                >
                  <IoRemoveCircle />
                </Box>
              ) : (
                <Box minW={`16px`} />
              )}
            </Flex>
          ))}
        </InputWrapper>
        <Box>
          <Flex className="btn-add-faq" onClick={onAddChoice}>
            <BiPlus /> <Text>Add more faq</Text>
          </Flex>
        </Box>
        <Box mt={6} />
        <WrapperConnected className="btn-submit">
          {!isApproveToken && tokenSelected ? (
            <FiledButton
              isLoading={loading}
              isDisabled={loading}
              loadingText="Processing"
              btnSize={'h'}
              onClick={onApprove}
              type="button"
              processInfo={{
                id: transactionType.idoManage,
              }}
            >
              {`APPROVE USE OF ${tokenSelected?.symbol}`}
            </FiledButton>
          ) : (
            <Flex width={'100%'} justifyContent={'center'} gap={6}>
              <FiledButton
                isLoading={loading}
                isDisabled={loading}
                type="submit"
                btnSize="h"
                containerConfig={{
                  style: {
                    width: '100%',
                  },
                }}
                className={
                  detail && !detail.launchpad ? 'btn-secondary' : 'btn-primary'
                }
              >
                {detail ? 'Update' : 'Submit'}
              </FiledButton>
              {detail && !detail.launchpad && (
                <FiledButton
                  isLoading={loading}
                  isDisabled={loading}
                  type="submit"
                  // processInfo={{
                  //   id: transactionType.createLaunchpad,
                  // }}
                  btnSize="h"
                  containerConfig={{
                    style: {
                      width: '100%',
                    },
                  }}
                  onClick={() => change('isCreateProposal', true)}
                >
                  {'Submit proposal'}
                </FiledButton>
              )}
            </Flex>
          )}
        </WrapperConnected>
      </Box>
    </form>
  );
};

export default IdoTokenManageForm;
