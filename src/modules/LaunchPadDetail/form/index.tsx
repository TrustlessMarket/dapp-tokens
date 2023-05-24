/* eslint-disable react/no-children-prop */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {transactionType} from '@/components/Swap/alertInfoProcessing/types';
import FiledButton from '@/components/Swap/button/filedButton';
import FieldAmount from '@/components/Swap/form/fieldAmount';
import InputWrapper from '@/components/Swap/form/inputWrapper';
import HorizontalItem from '@/components/Swap/horizontalItem';
import TokenBalance from '@/components/Swap/tokenBalance';
import WrapperConnected from '@/components/WrapperConnected';
import {CDN_URL, UNIV2_ROUTER_ADDRESS} from '@/configs';
import {BRIDGE_SUPPORT_TOKEN, TRUSTLESS_BRIDGE, TRUSTLESS_FAUCET,} from '@/constants/common';
import {toastError} from '@/constants/error';
import {AssetsContext} from '@/contexts/assets-context';
import useGetReserves from '@/hooks/contract-operations/swap/useReserves';
import useApproveERC20Token from '@/hooks/contract-operations/token/useApproveERC20Token';
import useBalanceERC20Token from '@/hooks/contract-operations/token/useBalanceERC20Token';
import useIsApproveERC20Token from '@/hooks/contract-operations/token/useIsApproveERC20Token';
import useContractOperation from '@/hooks/contract-operations/useContractOperation';
import {IToken} from '@/interfaces/token';
import {TransactionStatus} from '@/interfaces/walletTransaction';
import {getSwapTokens, logErrorToServer} from '@/services/swap';
import {useAppDispatch, useAppSelector} from '@/state/hooks';
import {
  requestReload,
  requestReloadRealtime,
  selectPnftExchange,
  updateCurrentTransaction,
} from '@/state/pnftExchange';
import {getIsAuthenticatedSelector, getUserSelector} from '@/state/user/selector';
import {camelCaseKeys, compareString, formatCurrency,} from '@/utils';
import {isDevelop} from '@/utils/commons';
import {composeValidators, required} from '@/utils/formValidate';
import px2rem from '@/utils/px2rem';
import {showError} from '@/utils/toast';
import {
  Box,
  Center,
  Flex,
  forwardRef,
  Progress,
  ProgressLabel,
  Stat,
  StatLabel,
  StatNumber,
  Text,
} from '@chakra-ui/react';
import {useWeb3React} from '@web3-react/core';
import BigNumber from 'bignumber.js';
import cx from 'classnames';
import debounce from 'lodash/debounce';
import Link from 'next/link';
import {useRouter} from 'next/router';
import React, {useCallback, useContext, useEffect, useImperativeHandle, useMemo, useRef, useState,} from 'react';
import {Field, Form, useForm, useFormState} from 'react-final-form';
import toast from 'react-hot-toast';
import {useDispatch, useSelector} from 'react-redux';
import Web3 from 'web3';
import styles from './styles.module.scss';
import {BiBell} from 'react-icons/bi';
import {ROUTE_PATH} from '@/constants/route-path';
import {closeModal, openModal} from '@/state/modal';
import {useWindowSize} from '@trustless-computer/dapp-core';
import ModalConfirmApprove from '@/components/ModalConfirmApprove';
import {getUserBoost} from "@/services/launchpad";
import useDepositLaunchpad from '@/hooks/contract-operations/launchpad/useDeposit';

const LIMIT_PAGE = 50;
const FEE = 2;
export const MakeFormSwap = forwardRef((props, ref) => {
  const { onSubmit, submitting, poolDetail } = props;
  const [loading, setLoading] = useState(false);
  const [baseToken, setBaseToken] = useState<any>();
  const [quoteToken, setQuoteToken] = useState<any>();
  const [amountBaseTokenApproved, setAmountBaseTokenApproved] = useState('0');
  const [tokensList, setTokensList] = useState<IToken[]>([]);
  const [baseTokensList, setBaseTokensList] = useState<IToken[]>([]);
  const { call: isApproved } = useIsApproveERC20Token();
  const { call: tokenBalance } = useBalanceERC20Token();
  const { call: approveToken } = useApproveERC20Token();
  const { call: getReserves } = useGetReserves();
  const [baseBalance, setBaseBalance] = useState<any>('0');
  const { juiceBalance, isLoadedAssets } = useContext(AssetsContext);
  const isAuthenticated = useSelector(getIsAuthenticatedSelector);
  const dispatch = useDispatch();
  const [isChangeBaseToken, setIsChangeBaseToken] = useState(false);
  const router = useRouter();

  const { account } = useWeb3React();
  const needReload = useAppSelector(selectPnftExchange).needReload;
  const [boostInfo, setBoostInfo] = useState<any>();

  // console.log('baseToken', baseToken);
  // console.log('quoteToken', quoteToken);
  // console.log('poolDetail', poolDetail);
  // console.log('boostInfo', boostInfo);
  // console.log('======');

  const { values } = useFormState();
  const { change, restart } = useForm();
  const btnDisabled = loading || !baseToken;
  // const isRequireApprove =
  //   isAuthenticated &&
  //   new BigNumber(amountBaseTokenApproved || 0).lt(
  //     Web3.utils.toWei(`${values?.baseAmount || 0}`, 'ether'),
  //   );

  // console.log('values', values);
  // console.log('=====')

  const isRequireApprove = useMemo(() => {
    let result = false;
    try {
      result =
        isAuthenticated &&
        values?.baseAmount &&
        !isNaN(Number(values?.baseAmount)) &&
        new BigNumber(amountBaseTokenApproved || 0).lt(
          Web3.utils.toWei(`${values?.baseAmount || 0}`, 'ether'),
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
  }, [isAuthenticated, amountBaseTokenApproved, values?.baseAmount]);

  const percent = useMemo(() => {
    if(poolDetail?.id) {
      return new BigNumber(poolDetail?.totalValue).div(poolDetail?.totalValue).toNumber();
    }

    return 0;
  }, [poolDetail?.id, needReload]);

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
      baseToken: values?.baseToken,
      quoteToken: values?.quoteToken,
    });

    try {
      const [_baseBalance, _quoteBalance] = await Promise.all([
        getTokenBalance(values?.baseToken),
        getTokenBalance(values?.quoteToken),
      ]);
      setBaseBalance(_baseBalance);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchTokens();
  }, []);

  const getBoostInfo = async () => {
    try {
      const response = await getUserBoost({
        address: account,
        pool_address: router?.query?.pool_address,
      });
      setBoostInfo(response);
      change('boostInfo', boostInfo);
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    if (account && router?.query?.pool_address) {
      getBoostInfo();
    }
  }, [account, router?.query?.pool_address, needReload]);

  useEffect(() => {
    if(poolDetail?.id) {
      setBaseToken(poolDetail?.liquidityToken);
      setQuoteToken(poolDetail?.launchpadToken);
    }
  }, [poolDetail?.id]);

  useEffect(() => {
    if (router?.query?.from_token) {
      const token = baseTokensList.find((t: any) =>
        compareString(t.address, router?.query?.from_token),
      );

      if (token) {
        handleSelectBaseToken(token);
      }
    }
  }, [JSON.stringify(baseTokensList), router?.query?.from_token]);

  useEffect(() => {
    change('baseBalance', baseBalance);
  }, [baseBalance]);

  useEffect(() => {
    if (account && baseToken?.address) {
      checkApproveBaseToken(baseToken);
    }
  }, [account, baseToken?.address]);

  const checkApproveBaseToken = async (token: any) => {
    const [_isApprove] = await Promise.all([checkTokenApprove(token)]);
    setAmountBaseTokenApproved(_isApprove);
  };

  const fetchTokens = async (page = 1, isFetchMore = false) => {
    try {
      setLoading(true);
      const res = await getSwapTokens({
        limit: LIMIT_PAGE,
        page: page,
        is_test: isDevelop() ? '1' : '',
      });

      const list = res ? camelCaseKeys(res) : [];

      setTokensList(list);
      setBaseTokensList(list);

      // const token = list.find((t: any) =>
      //   compareString(t.address, router?.query?.from_token || WBTC_ADDRESS),
      // );
      //
      // if (token) {
      //   handleSelectBaseToken(token);
      // }
    } catch (err: unknown) {
      console.log('Failed to fetch tokens owned');
    } finally {
      setLoading(false);
    }
  };

  const checkTokenApprove = async (token: IToken) => {
    try {
      const response = await isApproved({
        erc20TokenAddress: token.address,
        address: UNIV2_ROUTER_ADDRESS,
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
        address: UNIV2_ROUTER_ADDRESS,
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

  const handleSelectBaseToken = async (token: IToken) => {
    if (compareString(baseToken?.address, token?.address)) {
      return;
    }
    setIsChangeBaseToken(true);
    setBaseToken(token);
    change('baseToken', token);
    router.replace(
      `${ROUTE_PATH.LAUNCHPAD_DETAIL}?from_token=${token.address}&to_token=${
        router?.query?.to_token || ''
      }`,
    );

    // try {
    //   const _fromTokens: any = await fetchFromTokens(token?.address);
    //   if (_fromTokens) {
    //     setQuoteTokensList(camelCaseKeys(_fromTokens));
    //     if (quoteToken) {
    //       const findIndex = _fromTokens.findIndex((v: { address: unknown }) =>
    //         compareString(v.address, quoteToken.address),
    //       );
    //
    //       if (findIndex < 0) {
    //         setQuoteToken(null);
    //         change('quoteToken', null);
    //       }
    //     } else {
    //       let token = null;
    //
    //       if (router?.query?.to_token) {
    //         token = _fromTokens.find((t: { address: unknown }) =>
    //           compareString(t.address, router?.query?.to_token),
    //         );
    //       }
    //       if (!token) {
    //         token = _fromTokens.find((t: { address: unknown }) =>
    //           compareString(t.address, DEV_ADDRESS),
    //         );
    //       }
    //       if (token) {
    //         handleSelectQuoteToken(token);
    //       }
    //     }
    //   }
    // } catch (error) {
    //   throw error;
    // }
  };

  const validateBaseAmount = useCallback(
    (_amount: any) => {
      if (!_amount) {
        return undefined;
      }
      if (new BigNumber(_amount).lte(0)) {
        return `Required`;
      }
      if (new BigNumber(_amount).gt(baseBalance)) {
        return `Insufficient balance.`;
      }

      return undefined;
    },
    [values.baseAmount],
  );

  const onChangeValueBaseAmount = (amount: any) => {
    onBaseAmountChange({
      amount,
      poolDetail
    });
  };

  const handleBaseAmountChange = ({
    amount,
    poolDetail
  }: {
    amount: any;
    poolDetail: any;
  }) => {
    try {
      if (
        !amount ||
        isNaN(Number(amount))
      )
        return;

      const quoteAmount = new BigNumber(amount).div(new BigNumber(poolDetail?.totalValue || 0).plus(amount)).multipliedBy(poolDetail?.launchpadBalance || 0);
      change('quoteAmount', quoteAmount.toFixed());
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
    change('baseAmount', baseBalance);
    onChangeValueBaseAmount(baseBalance);
  };

  const onShowModalApprove = () => {
    const id = 'modal';
    const onClose = () => dispatch(closeModal({ id }));
    dispatch(
      openModal({
        id,
        theme: 'dark',
        title: `APPROVE USE OF ${baseToken?.symbol}`,
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
      await requestApproveToken(baseToken);
      checkApproveBaseToken(baseToken);

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
      {isAuthenticated && (
        <Text color={'#1b77fd'}>Connect wallet to see your boost rate</Text>
      )}
      <Flex gap={2} color={'#FFFFFF'} mt={1}>
        {poolDetail && (
          <Stat>
            <StatLabel>Launchpad Balance</StatLabel>
            <StatNumber>{formatCurrency(poolDetail.launchpadBalance)}</StatNumber>
          </Stat>
        )}
        {isAuthenticated && boostInfo && (
          <Stat>
            <StatLabel>Boost rate</StatLabel>
            <StatNumber>{boostInfo.boost}%</StatNumber>
          </Stat>
        )}
      </Flex>
      <Flex direction={"column"}>
        <Box className={styles.progressBar}>
          <Progress
            w={["100%", "100%"]}
            h="24px"
            value={percent < 15 ? 15 : percent}
            borderRadius={12}
          >
            <ProgressLabel className={styles.progressLabel}>
              {/*{`${formatCurrency(sold, 2)} / ${formatCurrency(
                order?.initial_caps,
                2
              )}`}{" "}*/}
              ({formatCurrency(percent, 2)}%)
            </ProgressLabel>
          </Progress>
          {/*<Image src={fireImg} className={styles.fireImg} />*/}
        </Box>
        <Flex direction={"column"} mt={1}>
          <Text color={"brand.success.400"} fontSize={"xl"} fontWeight={"medium"}>{formatCurrency(poolDetail?.totalValue || 0)} {baseToken?.symbol}</Text>
          <Text color={"#FFFFFF"} fontSize={"xs"}>pledged of {formatCurrency(poolDetail?.goalBalance || 0)} {baseToken?.symbol} goal</Text>
        </Flex>
      </Flex>
      <InputWrapper
        className={cx(styles.inputAmountWrap, styles.inputBaseAmountWrap)}
        theme="light"
        label={
          <Text fontSize={px2rem(14)} color={'#FFFFFF'}>
            Amount
          </Text>
        }
        rightLabel={
          baseToken && (
            <Flex gap={2} fontSize={px2rem(14)} color={'#FFFFFF'}>
              <Flex gap={1} alignItems={'center'}>
                Balance:
                <TokenBalance
                  token={baseToken}
                  onBalanceChange={(_amount) => setBaseBalance(_amount)}
                />
                {baseToken?.symbol}
              </Flex>
              <Text
                cursor={'pointer'}
                color={'#3385FF'}
                onClick={handleChangeMaxBaseAmount}
                bgColor={'rgba(51, 133, 255, 0.2)'}
                borderRadius={'4px'}
                padding={'1px 12px'}
              >
                MAX
              </Text>
            </Flex>
          )
        }
      >
        <Flex gap={4} direction={'column'}>
          <Field
            name="baseAmount"
            children={FieldAmount}
            validate={composeValidators(required, validateBaseAmount)}
            fieldChanged={onChangeValueBaseAmount}
            disabled={submitting}
            // placeholder={"Enter number of tokens"}
            decimals={baseToken?.decimal || 18}
            className={styles.inputAmount}
            prependComp={
              baseToken && (
                <Flex gap={1} alignItems={'center'} color={'#FFFFFF'} paddingX={2}>
                  <img
                    src={
                      baseToken?.thumbnail ||
                      `${CDN_URL}/upload/1683530065704444020-1683530065-default-coin.svg`
                    }
                    alt={baseToken?.thumbnail || 'default-icon'}
                    className={'avatar'}
                  />
                  <Text fontSize={'sm'}>{baseToken?.symbol}</Text>
                </Flex>
              )
            }
            borderColor={'#353945'}
          />
        </Flex>
      </InputWrapper>
      {/*<Box mt={1}>
        <HorizontalItem
          label={
            <Text fontSize={'sm'} fontWeight={'medium'} color={'rgba(255, 255, 255, 0.7)'}>
              FEE: {FEE * (swapRoutes?.length || 1)}%
            </Text>
          }
        />
      </Box>*/}
      {/*{baseToken && quoteToken && values?.baseAmount && Number(exchangeRate) > 0 && (
        <Box mt={1}>
          <HorizontalItem
            label={
              <Text fontSize={'sm'} fontWeight={'medium'} color={'#FFFFFF'}>
                1 {quoteToken?.symbol} =&nbsp;
                {formatCurrency(exchangeRate.toString(), baseToken?.decimal || 18)}
                &nbsp;{baseToken?.symbol}
              </Text>
            }
          />
        </Box>
      )}*/}
      {
        values?.baseAmount && (
          <Box mt={1}>
            <HorizontalItem
              label={
                <Text fontSize={'sm'} color={'#B1B5C3'}>
                  Estimate receive amount
                </Text>
              }
              value={
                <Text fontSize={'sm'} color={"#FFFFFF"}>
                  {formatCurrency(values?.quoteAmount, 6)} {poolDetail?.launchpadToken?.symbol}
                </Text>
              }
            />
          </Box>
        )
      }
      {isAuthenticated &&
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
              Your TC balance is insufficient. You can receive free TC on our faucet
              site{' '}
              <Link
                href={TRUSTLESS_FAUCET}
                target={'_blank'}
                style={{ textDecoration: 'underline' }}
              >
                here
              </Link>
              .
            </Text>
          </Flex>
        )}
      {isAuthenticated &&
        baseToken &&
        BRIDGE_SUPPORT_TOKEN.includes(baseToken?.symbol) &&
        new BigNumber(baseBalance || 0).lte(0) && (
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
              Insufficient {baseToken?.symbol} balance! Consider swapping your{' '}
              {baseToken?.symbol?.replace('W', '')} to trustless network{' '}
              <Link
                href={`${TRUSTLESS_BRIDGE}${baseToken?.symbol
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
        )}
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
            }}
          >
            APPROVE USE OF {baseToken?.symbol}
          </FiledButton>
        ) : (
          <FiledButton
            isDisabled={submitting || btnDisabled}
            isLoading={submitting}
            type="submit"
            // borderRadius={'100px !important'}
            // className="btn-submit"
            btnSize={'h'}
            containerConfig={{ flex: 1, mt: 6 }}
            loadingText={submitting ? 'Processing' : ' '}
            processInfo={{
              id: transactionType.createPoolApprove,
            }}
          >
            BACK THIS PROJECT
          </FiledButton>
        )}
      </WrapperConnected>
    </form>
  );
});

const BuyForm = ({ poolDetail }: any) => {
  const refForm = useRef<any>();
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useAppDispatch();
  const { account } = useWeb3React();
  const { run: depositLaunchpad } = useContractOperation({
    operation: useDepositLaunchpad,
  });
  const user = useSelector(getUserSelector);
  const slippage = useAppSelector(selectPnftExchange).slippage;
  const { mobileScreen } = useWindowSize();

  const confirmDeposit = (values: any) => {
    const { baseAmount, quoteAmount, onConfirm } = values;
    const id = 'modalDepositConfirm';
    // const close = () => dispatch(closeModal({id}));
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
        render: () => (
          <Flex direction={'column'} gap={2}>
            <HorizontalItem
              label={
                <Text fontSize={'sm'} color={'#B1B5C3'}>
                  Deposit amount
                </Text>
              }
              value={
                <Text fontSize={'sm'}>
                  {formatCurrency(baseAmount, 6)} {poolDetail?.liquidityToken?.symbol}
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
                  {formatCurrency(quoteAmount, 6)} {poolDetail?.launchpadToken?.symbol}
                </Text>
              }
            />
            {/*<HorizontalItem
              label={
                <Text fontSize={'sm'} color={'#B1B5C3'}>
                  Slippage
                </Text>
              }
              value={<Text fontSize={'sm'}>{slippage}%</Text>}
            />
            <Flex
              gap={1}
              alignItems={slippage === 100 ? 'center' : 'flex-start'}
              mt={2}
            >
              <img
                src={`${CDN_URL}/icons/icon-information.png`}
                alt="info"
                style={{ width: 25, height: 25, minWidth: 25, minHeight: 25 }}
              />
              <Text
                fontSize="sm"
                color="brand.warning.400"
                textAlign={'left'}
                maxW={'500px'}
              >
                {slippage === 100
                  ? `Your current slippage is set at 100%. Trade at your own risk.`
                  : `Your slippage percentage of ${slippage}% means that if the price changes by ${slippage}%, your transaction will fail and revert. If you wish to change your slippage percentage, please close this confirmation popup and go to the top of the swap box where you can set a different slippage value.`}
              </Text>
            </Flex>*/}
            <FiledButton
              loadingText="Processing"
              btnSize={'h'}
              onClick={onConfirm}
              mt={4}
            >
              Confirm
            </FiledButton>
          </Flex>
        ),
      }),
    );
  };

  const handleSubmit = async (values: any) => {
    console.log('handleSubmit', values);
    const id = 'modalDepositConfirm';
    const close = () => dispatch(closeModal({ id }));

    confirmDeposit({
      ...values,
      onConfirm: () => {
        close();
        handleDeposit(values);
      },
    });
  };

  const handleDeposit = async (values: any) => {
    const { boostInfo, baseAmount, quoteAmount, swapRoutes } = values;

    try {
      setSubmitting(true);
      dispatch(
        updateCurrentTransaction({
          status: TransactionStatus.info,
          id: transactionType.depositLaunchpad,
        }),
      );

      // const amountOutMin = new BigNumber(quoteAmount)
      //   .multipliedBy(100 - slippage)
      //   .dividedBy(100)
      //   .decimalPlaces(quoteToken?.decimal || 18)
      //   .toString();
      //
      // const addresses =
      //   !compareString(baseToken?.address, WBTC_ADDRESS) &&
      //   !compareString(quoteToken?.address, WBTC_ADDRESS) &&
      //   swapRoutes?.length > 1
      //     ? [baseToken.address, WBTC_ADDRESS, quoteToken.address]
      //     : ((compareString(baseToken?.address, WBTC_ADDRESS) && compareString(quoteToken?.address, GM_ADDRESS))
      //     || (compareString(baseToken?.address, GM_ADDRESS) && compareString(quoteToken?.address, WBTC_ADDRESS))
      //   ) && swapRoutes?.length > 1 ? [baseToken.address, WETH_ADDRESS, quoteToken.address]
      //       : [baseToken.address, quoteToken.address];

      const data = {
        amount: baseAmount,
        launchpadAddress: poolDetail?.launchpad,
        boostRatio: "0",
        signature: ''
      };

      if(boostInfo) {
        data.boostRatio = boostInfo.boost.toString();
        data.signature = boostInfo.adminSignature;
      }

      console.log('dataaaaa', data);

      const response = await depositLaunchpad(data);

      toast.success('Transaction has been created. Please wait for few minutes.');
      refForm.current?.reset();
      dispatch(requestReload());
      dispatch(requestReloadRealtime());
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

export default BuyForm;
