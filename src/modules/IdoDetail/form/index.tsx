/* eslint-disable react/no-children-prop */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {transactionType} from '@/components/Swap/alertInfoProcessing/types';
import FiledButton from '@/components/Swap/button/filedButton';
import FilterButton from '@/components/Swap/filterToken';
import FieldAmount from '@/components/Swap/form/fieldAmount';
import InputWrapper from '@/components/Swap/form/inputWrapper';
import HorizontalItem from '@/components/Swap/horizontalItem';
import TokenBalance from '@/components/Swap/tokenBalance';
import WrapperConnected from '@/components/WrapperConnected';
import {CDN_URL, UNIV2_ROUTER_ADDRESS} from '@/configs';
import {
  BRIDGE_SUPPORT_TOKEN,
  GM_ADDRESS,
  TRUSTLESS_BRIDGE,
  TRUSTLESS_FAUCET,
  WBTC_ADDRESS,
  WETH_ADDRESS,
} from '@/constants/common';
import {toastError} from '@/constants/error';
import {AssetsContext} from '@/contexts/assets-context';
import useGetReserves from '@/hooks/contract-operations/swap/useReserves';
import useSwapERC20Token, {ISwapERC20TokenParams,} from '@/hooks/contract-operations/swap/useSwapERC20Token';
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
import {camelCaseKeys, compareString, formatCurrency, sortAddressPair,} from '@/utils';
import {isDevelop} from '@/utils/commons';
import {composeValidators, required} from '@/utils/formValidate';
import px2rem from '@/utils/px2rem';
import {showError} from '@/utils/toast';
import {Box, Center, Flex, forwardRef, Stat, StatLabel, StatNumber, Text} from '@chakra-ui/react';
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
import {BiBell} from "react-icons/bi";
import {ROUTE_PATH} from "@/constants/route-path";
import {closeModal, openModal} from "@/state/modal";
import {useWindowSize} from '@trustless-computer/dapp-core';
import ModalConfirmApprove from '@/components/ModalConfirmApprove';
import {getDetailLaunchpad, getUserBoost} from "@/services/launchpad";
import {getTokenDetail} from "@/services/token-explorer";

const LIMIT_PAGE = 50;
const FEE = 2;
export const MakeFormSwap = forwardRef((props, ref) => {
  const { onSubmit, submitting } = props;
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
  const [reserveInfos, setReserveInfos] = useState<any[]>([]);
  const { juiceBalance, isLoadedAssets } = useContext(AssetsContext);
  const isAuthenticated = useSelector(getIsAuthenticatedSelector);
  const dispatch = useDispatch();
  const [isChangeBaseToken, setIsChangeBaseToken] = useState(false);
  const router = useRouter();
  const [swapRoutes, setSwapRoutes] = useState<any[]>([]);

  const { account } = useWeb3React();
  const needReload = useAppSelector(selectPnftExchange).needReload;
  const [exchangeRate, setExchangeRate] = useState('0');
  const [boostInfo, setBoostInfo] = useState<any>();
  const [poolDetail, setPoolDetail] = useState<any>();

  console.log('baseToken', baseToken);
  console.log('quoteToken', quoteToken);
  console.log('poolDetail', poolDetail);
  console.log('boostInfo', boostInfo);
  console.log('======');

  const { values } = useFormState();
  const { change, restart } = useForm();
  const btnDisabled = loading || !baseToken;
  // const isRequireApprove =
  //   isAuthenticated &&
  //   new BigNumber(amountBaseTokenApproved || 0).lt(
  //     Web3.utils.toWei(`${values?.baseAmount || 0}`, 'ether'),
  //   );

  const isRequireApprove = useMemo(() => {
    let result = false;
    try {
      result =
        isAuthenticated && values?.baseAmount && !isNaN(Number(values?.baseAmount)) &&
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
      const response = await getUserBoost({address: account, pool_address: router?.query?.pool_address});
      setBoostInfo(response);
    } catch (err) {
      throw err;
    }
  }

  useEffect(() => {
    if(account && router?.query?.pool_address) {
      getBoostInfo();
    }
  }, [account, router?.query?.pool_address]);

  const getPoolInfo = async () => {
    try {
      const response = await getDetailLaunchpad({pool_address: router?.query?.pool_address});
      setPoolDetail(response);
    } catch (err) {
      throw err;
    }
  }

  useEffect(() => {
    if(router?.query?.pool_address) {
      getPoolInfo();
    }
  }, [router?.query?.pool_address]);

  const getTokensInfo = async () => {
    try {
      const [res1, res2] = await Promise.all([
        getTokenDetail(poolDetail.liquidityTokenAddress),
        getTokenDetail(poolDetail.launchpadToken),
      ]);

      setBaseToken(res1);
      setQuoteToken(res2);
    } catch (e) {
      throw e;
    }
  }

  useEffect(() => {
    if(poolDetail?.id) {
      getTokensInfo();
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

  const getQuoteAmountOut = (
    amountIn: BigNumber,
    reserveIn: BigNumber,
    reserveOut: BigNumber,
  ): BigNumber => {
    try {
      const amountInWithFee = amountIn.multipliedBy(1000 - FEE * 10);
      const numerator = amountInWithFee.multipliedBy(reserveOut);
      const denominator = reserveIn.multipliedBy(1000).plus(amountInWithFee);
      const amountOut = numerator.div(denominator).decimalPlaces(18);

      return amountOut;
    } catch (err: any) {
      logErrorToServer({
        type: 'error',
        address: account,
        error: JSON.stringify(err),
        message: err?.message,
        place_happen: 'getQuoteAmountOut',
      });

      return new BigNumber(0);
    }
  };

  const getBaseAmountOut = (
    amountIn: BigNumber,
    reserveIn: BigNumber,
    reserveOut: BigNumber,
  ): BigNumber => {
    try {
      const amountInWithFee = amountIn.multipliedBy(1000 + FEE * 10);
      const numerator = amountInWithFee.multipliedBy(reserveOut);
      const denominator = reserveIn.multipliedBy(1000).plus(amountInWithFee);
      const amountOut = numerator.div(denominator).decimalPlaces(18);

      return amountOut;
    } catch (err: any) {
      logErrorToServer({
        type: 'error',
        address: account,
        error: JSON.stringify(err),
        message: err?.message,
        place_happen: 'getBaseAmountOut',
      });

      return new BigNumber(0);
    }
  };

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
      reserveInfos,
      tokenIn: baseToken,
      tokenOut: quoteToken,
      swapRoutes: swapRoutes,
    });
  };

  const calculateQuoteAmountMultiRoute = (
    {
      amount,
      reserveInfos,
      tokenIn,
      tokenOut,
      swapRoutes,
      listPair
    }: {
      amount: any;
      reserveInfos: any;
      tokenIn: any;
      tokenOut: any;
      swapRoutes: any;
      listPair: any[];
    }
  ) => {
    let _amount = amount;
    for (let index = 0; index < listPair?.length; index++) {
      const {baseToken, quoteToken} = listPair[index];
      const [token0, token1] = sortAddressPair(baseToken, quoteToken);

      const {_reserveIn, _reserveOut} = compareString(
        token0?.address,
        baseToken?.address,
      )
        ? {
          _reserveIn: reserveInfos[index]?._reserve0,
          _reserveOut: reserveInfos[index]?._reserve1,
        }
        : {
          _reserveIn: reserveInfos[index]?._reserve1,
          _reserveOut: reserveInfos[index]?._reserve0,
        };

      const amountIn = new BigNumber(_amount);
      const reserveIn = new BigNumber(
        Web3.utils.fromWei(Web3.utils.toBN(_reserveIn || 0), 'ether').toString(),
      );
      const reserveOut = new BigNumber(
        Web3.utils
          .fromWei(Web3.utils.toBN(_reserveOut || 0), 'ether')
          .toString(),
      );
      if (amountIn.lte(0) || reserveIn.lte(0) || reserveOut.lte(0)) {
        return;
      }

      _amount = getQuoteAmountOut(amountIn, reserveIn, reserveOut);
    }

    const rate = new BigNumber(amount)
      .div(_amount)
      .decimalPlaces(tokenIn?.decimal || 18);

    setExchangeRate(rate.toString());
    change('quoteAmount', _amount.toFixed());
  }

  const handleBaseAmountChange = ({
    amount,
    reserveInfos,
    tokenIn,
    tokenOut,
    swapRoutes,
  }: {
    amount: any;
    reserveInfos: any;
    tokenIn: any;
    tokenOut: any;
    swapRoutes: any;
  }) => {
    try {
      if (
        !amount ||
        isNaN(Number(amount)) ||
        !tokenIn?.address ||
        !tokenOut?.address
      )
        return;

      if (
        !compareString(tokenIn?.address, WBTC_ADDRESS) &&
        !compareString(tokenOut?.address, WBTC_ADDRESS) &&
        swapRoutes?.length > 1
      ) {
        const listPair = [
          {baseToken: tokenIn, quoteToken: {address: WBTC_ADDRESS}},
          {baseToken: {address: WBTC_ADDRESS}, quoteToken: tokenOut},
        ];

        calculateQuoteAmountMultiRoute({
          amount,
          reserveInfos,
          tokenIn,
          tokenOut,
          swapRoutes,
          listPair
        });
      } else if (
        ((compareString(tokenIn?.address, WBTC_ADDRESS) && compareString(tokenOut?.address, GM_ADDRESS))
          || (compareString(tokenIn?.address, GM_ADDRESS) && compareString(tokenOut?.address, WBTC_ADDRESS))
        ) && swapRoutes?.length > 1
      ) {
        const listPair = [
          {baseToken: tokenIn, quoteToken: {address: WETH_ADDRESS}},
          {baseToken: {address: WETH_ADDRESS}, quoteToken: tokenOut},
        ];

        calculateQuoteAmountMultiRoute({
          amount,
          reserveInfos,
          tokenIn,
          tokenOut,
          swapRoutes,
          listPair
        });
      } else {
        const [token0, token1] = sortAddressPair(tokenIn, tokenOut);

        const { _reserveIn, _reserveOut } = compareString(
          token0?.address,
          tokenIn?.address,
        )
          ? {
              _reserveIn: reserveInfos[0]?._reserve0,
              _reserveOut: reserveInfos[0]?._reserve1,
            }
          : {
              _reserveIn: reserveInfos[0]?._reserve1,
              _reserveOut: reserveInfos[0]?._reserve0,
            };

        const amountIn = new BigNumber(amount);
        const reserveIn = new BigNumber(
          Web3.utils.fromWei(Web3.utils.toBN(_reserveIn || 0), 'ether').toString(),
        );
        const reserveOut = new BigNumber(
          Web3.utils.fromWei(Web3.utils.toBN(_reserveOut || 0), 'ether').toString(),
        );
        if (amountIn.lte(0) || reserveIn.lte(0) || reserveOut.lte(0)) {
          return;
        }

        const quoteAmount = getQuoteAmountOut(amountIn, reserveIn, reserveOut);

        const rate = new BigNumber(amount)
          .div(quoteAmount)
          .decimalPlaces(tokenIn?.decimal || 18);
        setExchangeRate(rate.toString());

        // console.log('handleBaseAmountChange', quoteAmount.toFixed());
        change('quoteAmount', quoteAmount.toFixed());
      }
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
      {isAuthenticated && <Text color={"#1b77fd"}>Connect wallet to see your boost rate</Text>}
      <Flex gap={2} color={"#FFFFFF"} mt={1}>
        {
          poolDetail && (
            <Stat >
              <StatLabel>Launchpad Balance</StatLabel>
              <StatNumber>
                {formatCurrency(poolDetail.launchpadBalance)}
              </StatNumber>
            </Stat>
          )
        }
        {
          isAuthenticated && boostInfo && (
            <Stat>
              <StatLabel>Boost rate</StatLabel>
              <StatNumber>
                {boostInfo.boost}%
              </StatNumber>
            </Stat>
          )
        }
      </Flex>
      <InputWrapper
        className={cx(styles.inputAmountWrap, styles.inputBaseAmountWrap)}
        theme="light"
        label={<Text fontSize={px2rem(14)} color={"#FFFFFF"}>Amount</Text>}
        rightLabel={
          baseToken && (
            <Flex gap={2} fontSize={px2rem(14)} color={"#FFFFFF"}>
              <Flex gap={1} alignItems={"center"}>
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
                bgColor={"rgba(51, 133, 255, 0.2)"}
                borderRadius={"4px"}
                padding={"1px 12px"}
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
              <FilterButton
                data={baseTokensList}
                commonData={baseTokensList.slice(0, 3)}
                handleSelectItem={handleSelectBaseToken}
                parentClose={close}
                value={baseToken}
              />
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
      {baseToken && quoteToken && values?.baseAmount && Number(exchangeRate) > 0 && (
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
      )}
      {isAuthenticated &&
        isLoadedAssets &&
        new BigNumber(juiceBalance || 0).lte(0) && (
          <Flex gap={3} mt={2}>
            <Center
              w={'24px'}
              h={'24px'}
              borderRadius={'50%'}
              bg={'rgba(255, 126, 33, 0.2)'}
              as={"span"}
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
            as={"span"}
          >
            <BiBell color="#FF7E21" />
          </Center>
          <Text fontSize="sm" color="#FF7E21" textAlign={'left'}>
            Insufficient {baseToken?.symbol} balance! Consider swapping your{' '}
            {baseToken?.symbol?.replace('W', '')} to trustless network{' '}
            <Link
              href={`${TRUSTLESS_BRIDGE}${baseToken?.symbol?.replace('W', '')?.toLowerCase()}`}
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
            BUY
          </FiledButton>
        )}
      </WrapperConnected>
    </form>
  );
});

const BuyForm = () => {
  const refForm = useRef<any>();
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useAppDispatch();
  const { account } = useWeb3React();
  const { run: swapToken } = useContractOperation<ISwapERC20TokenParams, boolean>({
    operation: useSwapERC20Token,
  });
  const user = useSelector(getUserSelector);
  const slippage = useAppSelector(selectPnftExchange).slippage;
  const { mobileScreen } = useWindowSize();

  const confirmSwap = (values: any) => {
    const { baseToken, quoteToken, baseAmount, quoteAmount, onConfirm } = values;
    const id = 'modalSwapConfirm';
    // const close = () => dispatch(closeModal({id}));
    dispatch(
      openModal({
        id,
        theme: 'dark',
        title: 'Confirm swap',
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
                  Swap amount
                </Text>
              }
              value={
                <Text fontSize={'sm'}>
                  {formatCurrency(baseAmount, 6)} {baseToken?.symbol}
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
                  {formatCurrency(quoteAmount, 6)} {quoteToken?.symbol}
                </Text>
              }
            />
            <HorizontalItem
              label={
                <Text fontSize={'sm'} color={'#B1B5C3'}>
                  Slippage
                </Text>
              }
              value={<Text fontSize={'sm'}>{slippage}%</Text>}
            />
            <Flex gap={1} alignItems={slippage === 100 ? 'center' : 'flex-start'} mt={2}>
              <img
                src={`${CDN_URL}/icons/icon-information.png`}
                alt="info"
                style={{width: 25, height: 25, minWidth: 25, minHeight: 25}}
              />
              <Text fontSize="sm" color="brand.warning.400" textAlign={'left'} maxW={"500px"}>
                {
                  slippage === 100
                    ? `Your current slippage is set at 100%. Trade at your own risk.`
                    : `Your slippage percentage of ${slippage}% means that if the price changes by ${slippage}%, your transaction will fail and revert. If you wish to change your slippage percentage, please close this confirmation popup and go to the top of the swap box where you can set a different slippage value.`
                }
              </Text>
            </Flex>
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
    const id = 'modalSwapConfirm';
    const close = () => dispatch(closeModal({ id }));

    confirmSwap({
      ...values,
      onConfirm: () => {
        close();
        handleSwap(values);
      },
    });
  };

  const handleSwap = async (values: any) => {
    const { baseToken, quoteToken, baseAmount, quoteAmount, swapRoutes } = values;

    try {
      setSubmitting(true);
      dispatch(
        updateCurrentTransaction({
          status: TransactionStatus.info,
          id: transactionType.createPoolApprove,
        }),
      );

      const amountOutMin = new BigNumber(quoteAmount)
        .multipliedBy(100 - slippage)
        .dividedBy(100)
        .decimalPlaces(quoteToken?.decimal || 18)
        .toString();

      const addresses =
        !compareString(baseToken?.address, WBTC_ADDRESS) &&
        !compareString(quoteToken?.address, WBTC_ADDRESS) &&
        swapRoutes?.length > 1
          ? [baseToken.address, WBTC_ADDRESS, quoteToken.address]
          : ((compareString(baseToken?.address, WBTC_ADDRESS) && compareString(quoteToken?.address, GM_ADDRESS))
          || (compareString(baseToken?.address, GM_ADDRESS) && compareString(quoteToken?.address, WBTC_ADDRESS))
        ) && swapRoutes?.length > 1 ? [baseToken.address, WETH_ADDRESS, quoteToken.address]
            : [baseToken.address, quoteToken.address];

      const data = {
        addresses: addresses,
        address: user?.walletAddress,
        amount: baseAmount,
        amountOutMin: amountOutMin,
      };

      const response = await swapToken(data);

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
          />
        )}
      </Form>
    </Box>
  );
};

export default BuyForm;
