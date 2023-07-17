/* eslint-disable react/no-children-prop */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import ModalConfirmApprove from '@/components/ModalConfirmApprove';
import { transactionType } from '@/components/Swap/alertInfoProcessing/types';
import FiledButton from '@/components/Swap/button/filedButton';
import FieldAmount from '@/components/Swap/form/fieldAmount';
import InputWrapper from '@/components/Swap/form/inputWrapper';
import HorizontalItem from '@/components/Swap/horizontalItem';
import TokenBalance from '@/components/Swap/tokenBalance';
import WrapperConnected from '@/components/WrapperConnected';
import { toastError } from '@/constants/error';
import useApproveERC20Token from '@/hooks/contract-operations/token/useApproveERC20Token';
import useBalanceERC20Token from '@/hooks/contract-operations/token/useBalanceERC20Token';
import useIsApproveERC20Token from '@/hooks/contract-operations/token/useIsApproveERC20Token';
import { IToken } from '@/interfaces/token';
import { TransactionStatus } from '@/components/Swap/alertInfoProcessing/interface';
import { logErrorToServer } from '@/services/swap';
import { useAppDispatch, useAppSelector } from '@/state/hooks';
import { closeModal, openModal } from '@/state/modal';
import {
  requestReload,
  requestReloadRealtime,
  selectPnftExchange,
  updateCurrentTransaction,
} from '@/state/pnftExchange';
import { getIsAuthenticatedSelector } from '@/state/user/selector';
import { colors } from '@/theme/colors';
import { formatCurrency } from '@/utils';
import { composeValidators, required } from '@/utils/formValidate';
import px2rem from '@/utils/px2rem';
import { showError } from '@/utils/toast';
import { Box, Flex, forwardRef, Text } from '@chakra-ui/react';
import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import cx from 'classnames';
import debounce from 'lodash/debounce';
import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Field, Form, useForm, useFormState } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import Web3 from 'web3';
import styles from './styles.module.scss';
import tokenIcons from '@/constants/tokenIcons';
import toast from 'react-hot-toast';
import { useWindowSize } from '@trustless-computer/dapp-core';
import useContractOperation from '@/hooks/contract-operations/useContractOperation';
import useDepositPool from '@/hooks/contract-operations/launchpad/useDeposit';
import {scanLaunchpadTxHash} from "@/services/launchpad";
import {IResourceChain} from "@/interfaces/chain";

export const MakeFormSwap = forwardRef((props, ref) => {
  const { onSubmit, submitting, poolDetail } = props;
  const [loading, setLoading] = useState(false);
  const [liquidityToken, setLiquidityToken] = useState<any>();
  const [launchpadToken, setLaunchpadToken] = useState<any>();
  const [amountLiquidityTokenApproved, setAmountLiquidityTokenApproved] =
    useState('0');
  const { call: isApproved } = useIsApproveERC20Token();
  const { call: tokenBalance } = useBalanceERC20Token();
  const { call: approveToken } = useApproveERC20Token();
  const [liquidityBalance, setLiquidityBalance] = useState<any>('0');
  const isAuthenticated = useSelector(getIsAuthenticatedSelector);
  const dispatch = useDispatch();

  const { account } = useWeb3React();
  const needReload = useAppSelector(selectPnftExchange).needReload;

  const { values } = useFormState();
  const { change, restart } = useForm();
  const btnDisabled = loading || !liquidityToken;

  const isRequireApprove = useMemo(() => {
    let result = false;
    try {
      result =
        isAuthenticated &&
        values?.liquidityAmount &&
        !isNaN(Number(values?.liquidityAmount)) &&
        new BigNumber(amountLiquidityTokenApproved || 0).lt(
          Web3.utils.toWei(`${values?.liquidityAmount || 0}`, 'ether'),
        );
    } catch (err: any) {
      logErrorToServer({
        type: 'error',
        address: account,
        error: JSON.stringify(err),
        message: err?.message,
        place_happen: 'isRequireApprove',
      });
    }

    return result;
  }, [isAuthenticated, amountLiquidityTokenApproved, values?.liquidityAmount]);

  const onBaseAmountChange = useCallback(
    debounce((p) => handleBaseAmountChange(p), 1000),
    [],
  );

  useImperativeHandle(ref, () => {
    return {
      reset: reset,
    };
  });

  const reset = async () => {
    restart({
      liquidityToken: values?.liquidityToken,
      launchpadToken: values?.launchpadToken,
    });

    try {
      const [_baseBalance] = await Promise.all([
        getTokenBalance(values?.liquidityToken),
        // getTokenBalance(values?.launchpadToken),
      ]);
      setLiquidityBalance(_baseBalance);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    if (poolDetail?.id) {
      setLiquidityToken(poolDetail?.liquidityToken);
      setLaunchpadToken(poolDetail?.launchpadToken);
      change('liquidityToken', poolDetail?.liquidityToken);
      change('launchpadToken', poolDetail?.launchpadToken);
    }
  }, [poolDetail?.id]);

  useEffect(() => {
    change('liquidityBalance', liquidityBalance);
  }, [liquidityBalance]);

  useEffect(() => {
    if (account && liquidityToken?.address && poolDetail?.launchpad) {
      checkApproveBaseToken(liquidityToken);
    }
  }, [account, liquidityToken?.address, poolDetail?.launchpad]);

  const checkApproveBaseToken = async (token: any) => {
    const [_isApprove] = await Promise.all([checkTokenApprove(token)]);
    setAmountLiquidityTokenApproved(_isApprove);
  };

  const checkTokenApprove = async (token: IToken) => {
    try {
      const response = await isApproved({
        erc20TokenAddress: token.address,
        address: poolDetail?.launchpad,
      });
      return response;
    } catch (error) {
      console.log('error', error);
      throw error;
    }
  };

  const getTokenBalance = async (token: IToken) => {
    try {
      const response = await tokenBalance({
        erc20TokenAddress: token.address,
      });
      return response;
    } catch (error) {
      console.log('error', error);
      throw error;
    }
  };

  const requestApproveToken = async (token: IToken) => {
    try {
      dispatch(
        updateCurrentTransaction({
          id: transactionType.createPoolApprove,
          status: TransactionStatus.info,
        }),
      );
      const response: any = await approveToken({
        erc20TokenAddress: token.address,
        address: poolDetail?.launchpad,
      });
      dispatch(
        updateCurrentTransaction({
          status: TransactionStatus.success,
          id: transactionType.createPoolApprove,
          hash: response.hash,
          infoTexts: {
            success: `${token.symbol} has been approved successfully. You can swap now!`,
          },
        }),
      );
    } catch (error) {
      throw error;
    } finally {
      // dispatch(updateCurrentTransaction(null));
    }
  };

  const validateBaseAmount = useCallback(
    (_amount: any) => {
      if (!_amount) {
        return undefined;
      }
      if (new BigNumber(_amount).lte(0)) {
        return `Required`;
      }
      if (new BigNumber(_amount).gt(liquidityBalance)) {
        return `Insufficient balance.`;
      }

      if (
        Number(poolDetail?.thresholdBalance || 0) > 0 &&
        new BigNumber(_amount)
          .plus(poolDetail?.totalValue)
          .gt(poolDetail?.thresholdBalance)
      ) {
        return `Total amount deposit greater than ${
          poolDetail?.thresholdBalance
        }. Max allow deposit is ${new BigNumber(poolDetail?.thresholdBalance)
          .minus(poolDetail?.totalValue)
          .toNumber()}`;
      }

      return undefined;
    },
    [values.liquidityAmount],
  );

  const onChangeValueBaseAmount = (amount: any) => {
    onBaseAmountChange({
      amount,
      poolDetail,
    });
  };

  const handleBaseAmountChange = ({
    amount,
    poolDetail,
  }: {
    amount: any;
    poolDetail: any;
  }) => {
    try {
      if (!amount || isNaN(Number(amount))) return;

      const launchpadAmount = new BigNumber(amount)
        .div(new BigNumber(poolDetail?.totalValue || 0).plus(amount))
        .multipliedBy(poolDetail?.launchpadBalance || 0);
      change('launchpadAmount', launchpadAmount.toFixed());
    } catch (err: any) {
      logErrorToServer({
        type: 'error',
        address: account,
        error: JSON.stringify(err),
        message: err?.message,
        place_happen: 'handleBaseAmountChange',
      });
    }
  };

  const handleChangeMaxBaseAmount = () => {
    change('liquidityAmount', liquidityBalance);
    onChangeValueBaseAmount(liquidityBalance);
  };

  const onShowModalApprove = () => {
    const id = 'modal';
    const onClose = () => dispatch(closeModal({ id }));
    dispatch(
      openModal({
        id,
        theme: 'dark',
        title: `APPROVE USE OF ${liquidityToken?.symbol}`,
        className: styles.modalContent,
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

  const onApprove = async () => {
    try {
      setLoading(true);
      await requestApproveToken(liquidityToken);
      checkApproveBaseToken(liquidityToken);

      // toast.success('Transaction has been created. You can swap now!');
    } catch (err: any) {
      logErrorToServer({
        type: 'error',
        address: account,
        error: JSON.stringify(err),
        message: err?.message,
      });
      toastError(showError, err, { address: account });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} style={{ height: '100%' }}>
      <Text fontSize={px2rem(16)} fontWeight={400} color={'#1C1C1C'} opacity={0.7}>
        Deposit any amount of WETH.
      </Text>
      <InputWrapper
        className={cx(styles.inputAmountWrap, styles.inputBaseAmountWrap)}
        theme="light"
        label={
          <Text fontSize={px2rem(14)} color={'#FFFFFF'}>
            Amount
          </Text>
        }
        rightLabel={
          liquidityToken && (
            <Flex
              gap={1}
              alignItems={'center'}
              color={'#5B5B5B'}
              fontSize={px2rem(12)}
              fontWeight={'400'}
            >
              Balance:
              <TokenBalance
                token={liquidityToken}
                onBalanceChange={(_amount) => setLiquidityBalance(_amount)}
              />
              {liquidityToken?.symbol}
            </Flex>
          )
        }
      >
        <Flex gap={4} direction={'column'}>
          <Field
            name="liquidityAmount"
            children={FieldAmount}
            validate={composeValidators(required, validateBaseAmount)}
            fieldChanged={onChangeValueBaseAmount}
            disabled={submitting}
            // placeholder={"Enter number of tokens"}
            decimals={liquidityToken?.decimal || 18}
            className={styles.inputAmount}
            prependComp={
              liquidityToken && (
                <Flex gap={1} alignItems={'center'} color={'#000000'} paddingX={2}>
                  <img
                    src={tokenIcons[liquidityToken?.symbol?.toLowerCase()]}
                    alt={liquidityToken?.thumbnail || 'default-icon'}
                    className={'avatar'}
                  />
                  <Text fontSize={'sm'}>{liquidityToken?.symbol}</Text>
                </Flex>
              )
            }
            appendComp={
              liquidityToken && (
                <Text
                  cursor={'pointer'}
                  color={'#3385FF'}
                  onClick={handleChangeMaxBaseAmount}
                  bgColor={'rgba(51, 133, 255, 0.2)'}
                  borderRadius={'4px'}
                  padding={'1px 12px'}
                  fontSize={px2rem(16)}
                  fontWeight={'500'}
                >
                  Max
                </Text>
              )
            }
            borderColor={'#ECECED'}
          />
        </Flex>
      </InputWrapper>
      {values?.liquidityAmount && (
        <Box mt={1}>
          <HorizontalItem
            label={
              <Text fontSize={'sm'} color={'#5B5B5B'}>
                Estimate receive amount
              </Text>
            }
            value={
              <Text fontSize={'sm'} color={'#000000'}>
                {formatCurrency(values?.launchpadAmount, 6)}{' '}
                {poolDetail?.launchpadToken?.symbol}
              </Text>
            }
          />
        </Box>
      )}
      {/*{isAuthenticated &&
        isLoadedAssets &&
        new BigNumber(juiceBalance || 0).lte(0) && (
          <Flex gap={3} mt={2}>
            <Center
              w={'24px'}
              h={'24px'}
              borderRadius={'50%'}
              bg={'rgba(255, 126, 33, 0.2)'}
              as={'span'}
            >
              <BiBell color="#FF7E21" />
            </Center>
            <Text fontSize="sm" color="#FF7E21" textAlign={'left'}>
              Your TC balance is insufficient. Buy more TC{' '}
              <Link
                href={getTCGasStationddress()}
                target={'_blank'}
                style={{ textDecoration: 'underline' }}
              >
                here
              </Link>
              .
            </Text>
          </Flex>
        )}*/}
      {/*{isAuthenticated &&
        liquidityToken &&
        BRIDGE_SUPPORT_TOKEN.includes(liquidityToken?.symbol) &&
        new BigNumber(liquidityBalance || 0).lte(0) && (
          <Flex gap={3} mt={2}>
            <Center
              w={'24px'}
              h={'24px'}
              borderRadius={'50%'}
              bg={'rgba(255, 126, 33, 0.2)'}
              as={'span'}
            >
              <BiBell color="#FF7E21" />
            </Center>
            <Text fontSize="sm" color="#FF7E21" textAlign={'left'}>
              Insufficient {liquidityToken?.symbol} balance! Consider swapping your{' '}
              {liquidityToken?.symbol?.replace('W', '')} to trustless network{' '}
              <Link
                href={`${TRUSTLESS_BRIDGE}${liquidityToken?.symbol
                  ?.replace('W', '')
                  ?.toLowerCase()}`}
                target={'_blank'}
                style={{ textDecoration: 'underline' }}
              >
                here
              </Link>
              .
            </Text>
          </Flex>
        )}*/}
      <Box mt={6} />
      <WrapperConnected
        type={isRequireApprove ? 'button' : 'submit'}
        className={styles.submitButton}
      >
        {isRequireApprove ? (
          <FiledButton
            isLoading={loading}
            isDisabled={loading}
            loadingText="Processing"
            btnSize={'h'}
            containerConfig={{ flex: 1, mt: 6 }}
            onClick={onShowModalApprove}
            processInfo={{
              id: transactionType.createPoolApprove,
              theme: 'light',
            }}
          >
            APPROVE USE OF {liquidityToken?.symbol}
          </FiledButton>
        ) : (
          <FiledButton
            isDisabled={submitting || btnDisabled}
            isLoading={submitting}
            type="submit"
            btnSize={'h'}
            containerConfig={{ flex: 1, mt: 6 }}
            loadingText={submitting ? 'Processing' : ' '}
            processInfo={{
              id: transactionType.depositLaunchpad,
              theme: 'light',
            }}
            style={{
              backgroundColor: colors.bluePrimary,
            }}
          >
            {'CONTRIBUTE'}
          </FiledButton>
        )}
      </WrapperConnected>
    </form>
  );
});

const ContributeForm = (props: any) => {
  const { poolDetail, boostInfo, onClose } = props;
  const refForm = useRef<any>();
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useAppDispatch();
  const { mobileScreen } = useWindowSize();
  const { account, isActive } = useWeb3React();
  const currentChain: IResourceChain = useSelector(selectPnftExchange).currentChain;

  const { run: depositLaunchpad } = useContractOperation({
    operation: useDepositPool,
  });

  const handleSubmit = async (values: any) => {
    console.log('handleSubmit', values);

    confirmDeposit(values);
  };

  const confirmDeposit = (values: any) => {
    const { liquidityAmount, launchpadAmount, onConfirm } = values;
    const id = 'modalDepositConfirm';
    const close = () => dispatch(closeModal({ id }));
    dispatch(
      openModal({
        id,
        theme: 'dark',
        title: 'Confirm deposit',
        className: styles.modalContent,
        modalProps: {
          centered: true,
          size: mobileScreen ? 'full' : 'xl',
          zIndex: 9999999,
        },
        render: () => {
          return (
            <Box>
              <HorizontalItem
                label={
                  <Text fontSize={'sm'} color={'#B1B5C3'}>
                    Deposit amount
                  </Text>
                }
                value={
                  <Text fontSize={'sm'}>
                    {formatCurrency(liquidityAmount, 6)}{' '}
                    {poolDetail?.liquidityToken?.symbol}
                  </Text>
                }
              />
              <HorizontalItem
                label={
                  <Text fontSize={'sm'} color={'#B1B5C3'}>
                    Estimate receive amount
                  </Text>
                }
                value={
                  <Text fontSize={'sm'}>
                    {formatCurrency(launchpadAmount, 6)}{' '}
                    {poolDetail?.launchpadToken?.symbol}
                  </Text>
                }
              />
              <FiledButton
                loadingText="Processing"
                btnSize={'h'}
                onClick={() => {
                  close();
                  handleDeposit(values);
                }}
                mt={4}
              >
                Confirm
              </FiledButton>
            </Box>
          );
        },
      }),
    );
  };

  const handleDeposit = async (values: any) => {
    try {
      setSubmitting(true);
      dispatch(
        updateCurrentTransaction({
          status: TransactionStatus.info,
          id: transactionType.depositLaunchpad,
        }),
      );

      const { liquidityAmount } = values;
      const data = {
        amount: liquidityAmount,
        launchpadAddress: poolDetail?.launchpad,
        boostRatio: '0',
        signature: '',
        onBehalf: account,
      };

      if (boostInfo) {
        data.boostRatio = boostInfo.boostSign;
        data.signature = boostInfo.adminSignature;
      }
      const response = await depositLaunchpad(data);

      await scanLaunchpadTxHash({
        tx_hash: response.hash,
        network: currentChain?.chain?.toLowerCase()
      });

      toast.success('Transaction has been created. Please wait for few minutes.');
      refForm.current?.reset();
      dispatch(requestReload());
      dispatch(requestReloadRealtime());
      onClose && onClose();
    } catch (err: any) {
      toastError(showError, err, { address: account });
      logErrorToServer({
        type: 'error',
        address: account,
        error: JSON.stringify(err),
        message: err?.message,
      });
      // showError({
      //   message:
      //     (err as Error).message || 'Something went wrong. Please try again later.',
      // });
    } finally {
      setSubmitting(false);
      dispatch(updateCurrentTransaction(null));
    }
  };

  return (
    <Box className={styles.container}>
      <Form onSubmit={handleSubmit} initialValues={{}}>
        {({ handleSubmit }) => (
          <MakeFormSwap
            ref={refForm}
            onSubmit={handleSubmit}
            submitting={submitting}
            poolDetail={poolDetail}
          />
        )}
      </Form>
    </Box>
  );
};

export default ContributeForm;
