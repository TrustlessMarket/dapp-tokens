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
import {CDN_URL, UNIV3_ROUTER_ADDRESS} from '@/configs';
import {
  BRIDGE_SUPPORT_TOKEN,
  GM_ADDRESS,
  TOKEN_ICON_DEFAULT,
  TRUSTLESS_BRIDGE,
  TRUSTLESS_GASSTATION,
  USDC_ADDRESS,
  WBTC_ADDRESS,
} from '@/constants/common';
import {toastError} from '@/constants/error';
import {AssetsContext} from '@/contexts/assets-context';
import useGetReserves from '@/hooks/contract-operations/swap/useReserves';
import useSwapERC20Token, {ISwapERC20TokenParams} from '@/hooks/contract-operations/swap/v3/useSwapERC20Token';
import useApproveERC20Token, {IApproveERC20TokenParams} from '@/hooks/contract-operations/token/useApproveERC20Token';
import useBalanceERC20Token from '@/hooks/contract-operations/token/useBalanceERC20Token';
import useIsApproveERC20Token from '@/hooks/contract-operations/token/useIsApproveERC20Token';
import {IToken} from '@/interfaces/token';
import {TransactionStatus} from '@/interfaces/walletTransaction';
import {getSwapRoutesV2, getSwapTokensV1, ISwapRouteParams, logErrorToServer} from '@/services/swap';
import {useAppDispatch, useAppSelector} from '@/state/hooks';
import {
  requestReload,
  requestReloadRealtime,
  selectPnftExchange,
  updateCurrentTransaction,
} from '@/state/pnftExchange';
import {getIsAuthenticatedSelector} from '@/state/user/selector';
import {camelCaseKeys, compareString, formatCurrency,} from '@/utils';
import {isDevelop} from '@/utils/commons';
import {composeValidators, required} from '@/utils/formValidate';
import px2rem from '@/utils/px2rem';
import {showError} from '@/utils/toast';
import {Box, Center, Flex, forwardRef, Text} from '@chakra-ui/react';
import {useWeb3React} from '@web3-react/core';
import BigNumber from 'bignumber.js';
import cx from 'classnames';
import debounce from 'lodash/debounce';
import Link from 'next/link';
import {useRouter} from 'next/router';
import React, {useCallback, useContext, useEffect, useImperativeHandle, useMemo, useRef, useState,} from 'react';
import {Field, Form, useForm, useFormState} from 'react-final-form';
import toast from 'react-hot-toast';
import {RiArrowUpDownLine} from 'react-icons/ri';
import {useDispatch, useSelector} from 'react-redux';
import Web3 from 'web3';
import styles from './styles.module.scss';
import {BsListCheck} from 'react-icons/bs';
import {BiBell} from 'react-icons/bi';
import {ROUTE_PATH} from '@/constants/route-path';
import SlippageSettingButton from '@/components/Swap/slippageSetting/button';
import {closeModal, openModal} from '@/state/modal';
import {useWindowSize} from '@trustless-computer/dapp-core';
import InfoTooltip from '@/components/Swap/infoTooltip';
import ModalConfirmApprove from '@/components/ModalConfirmApprove';
import tokenIcons from '@/constants/tokenIcons';
import {L2_CHAIN_INFO} from "@/constants/chains";
import useEstimateSwapERC20Token, {
  IEstimateSwapERC20Token
} from "@/hooks/contract-operations/swap/v3/useEstimateSwapERC20Token";
import useContractOperation from "@/hooks/contract-operations/useContractOperation";

const LIMIT_PAGE = 500;
export const MakeFormSwap = forwardRef((props, ref) => {
  const { onSubmit, submitting } = props;
  const [loading, setLoading] = useState(false);
  const [baseToken, setBaseToken] = useState<any>();
  const [quoteToken, setQuoteToken] = useState<any>();
  const [amountBaseTokenApproved, setAmountBaseTokenApproved] = useState('0');
  const [amountQuoteTokenApproved, setAmountQuoteTokenApproved] = useState('0');
  const [tokensList, setTokensList] = useState<IToken[]>([]);
  const [baseTokensList, setBaseTokensList] = useState<IToken[]>([]);
  const [quoteTokensList, setQuoteTokensList] = useState<IToken[]>([]);
  const { call: isApproved } = useIsApproveERC20Token();
  const { call: tokenBalance } = useBalanceERC20Token();
  const { run: approveToken } = useContractOperation<IApproveERC20TokenParams, boolean>({
    operation: useApproveERC20Token,
  });
  const { call: getReserves } = useGetReserves();
  const [baseBalance, setBaseBalance] = useState<any>('0');
  const [quoteBalance, setQuoteBalance] = useState<any>('0');
  const { juiceBalance, isLoadedAssets } = useContext(AssetsContext);
  const isAuthenticated = useSelector(getIsAuthenticatedSelector);
  const dispatch = useDispatch();
  const [isSwitching, setIsSwitching] = useState(false);
  const router = useRouter();
  const [swapRoutes, setSwapRoutes] = useState<any[]>([]);
  const configs = useAppSelector(selectPnftExchange).configs;
  const swapFee = configs?.swapFee || 0.3;

  const { account} = useWeb3React();
  const [exchangeRate, setExchangeRate] = useState('0');
  const { call: getEstimateSwap } = useEstimateSwapERC20Token();

  // console.log('chainInfo', chainInfo);
  // console.log('isSwitching', isSwitching);
  // console.log('amountBaseTokenApproved', amountBaseTokenApproved);
  // console.log('formatEthPrice', formatEthPrice(amountBaseTokenApproved));
  // console.log('amountQuoteTokenApproved', amountQuoteTokenApproved);
  // console.log('baseBalance', baseBalance);
  // console.log('quoteBalance', quoteBalance);
  // console.log('baseToken', baseToken);
  // console.log('quoteToken', quoteToken);
  // console.log('baseReserve', baseReserve);
  // console.log('quoteReserve', quoteReserve);
  // console.log('quoteTokensList', quoteTokensList);
  // console.log('reserveInfos', reserveInfos);
  // console.log('swapRoutes', swapRoutes);
  // console.log('======');

  const { values } = useFormState();
  const { change, restart } = useForm();
  const btnDisabled = loading || !baseToken || !quoteToken;

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
      setQuoteBalance(_quoteBalance);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchTokens();
  }, []);

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
    if (router?.query?.to_token) {
      const token = quoteTokensList.find((t: any) =>
        compareString(t.address, router?.query?.to_token),
      );

      if (token) {
        handleSelectQuoteToken(token);
      }
    }
  }, [JSON.stringify(quoteTokensList), router?.query?.to_token]);

  useEffect(() => {
    if (baseToken?.address && quoteToken?.address) {
      getSwapRoutesInfo(baseToken?.address, quoteToken?.address);
    }
  }, [baseToken?.address, quoteToken?.address]);

  const getBaseAmountOut = (
    amountIn: BigNumber,
    reserveIn: BigNumber,
    reserveOut: BigNumber,
  ): BigNumber => {
    try {
      const amountInWithFee = amountIn.multipliedBy(1000 + swapFee * 10);
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

  useEffect(() => {
    if (account && quoteToken?.address) {
      checkApproveQuoteToken(quoteToken);
    }
  }, [account, quoteToken?.address]);

  const checkApproveBaseToken = async (token: any) => {
    const [_isApprove] = await Promise.all([checkTokenApprove(token)]);
    setAmountBaseTokenApproved(_isApprove);
  };

  const checkApproveQuoteToken = async (token: any) => {
    const [_isApprove] = await Promise.all([checkTokenApprove(token)]);
    setAmountQuoteTokenApproved(_isApprove);
  };

  const fetchTokens = async (page = 1, isFetchMore = false) => {
    try {
      setLoading(true);
      const res = await getSwapTokensV1({
        limit: LIMIT_PAGE,
        page: page,
        is_test: isDevelop() ? '1' : '',
        network: L2_CHAIN_INFO.chain.toLowerCase()
      });

      const list = res ? camelCaseKeys(res) : [];

      setTokensList(list);
      setBaseTokensList(list);
      setQuoteTokensList(list);

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

  const fetchFromTokens = async (from_token?: string) => {
    try {
      const res = await getSwapTokensV1({
        limit: LIMIT_PAGE,
        page: 1,
        is_test: isDevelop() ? '1' : '',
        from_token: from_token,
        network: L2_CHAIN_INFO.chain.toLowerCase()
      });
      return res;
    } catch (err: unknown) {
      console.log('Failed to fetch tokens owned');
    } finally {
    }
  };

  const getSwapRoutesInfo = async (from_token: string, to_token: string) => {
    try {
      const params: ISwapRouteParams = {
        from_token: from_token,
        to_token: to_token,
        network: L2_CHAIN_INFO.chain.toLowerCase()
      };
      const response = await getSwapRoutesV2(params);

      setSwapRoutes(response);
      change('swapRoutes', response);
      return response;
    } catch (error) {
      console.log('error', error);
    }
  };

  const checkTokenApprove = async (token: IToken) => {
    try {
      const response = await isApproved({
        erc20TokenAddress: token.address,
        address: UNIV3_ROUTER_ADDRESS,
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
        address: UNIV3_ROUTER_ADDRESS,
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
    setBaseToken(token);
    change('baseToken', token);
    router.replace(
      `${ROUTE_PATH.SWAP_V2}?from_token=${token.address}&to_token=${
        router?.query?.to_token || ''
      }`,
    );

    try {
      const _fromTokens: any = await fetchFromTokens(token?.address);
      if (_fromTokens) {
        setQuoteTokensList(camelCaseKeys(_fromTokens));
        if (quoteToken) {
          const findIndex = _fromTokens.findIndex((v: { address: unknown }) =>
            compareString(v.address, quoteToken.address),
          );

          if (findIndex < 0) {
            setQuoteToken(null);
            change('quoteToken', null);
          }
        } else {
          let token = null;

          if (router?.query?.to_token) {
            token = _fromTokens.find((t: { address: unknown }) =>
              compareString(t.address, router?.query?.to_token),
            );
          }
          if (!token) {
            token = _fromTokens.find((t: { address: unknown }) =>
              compareString(t.address, USDC_ADDRESS),
            );
          }
          if (token) {
            handleSelectQuoteToken(token);
          }
        }
      }
    } catch (error) {
      throw error;
    }
  };

  const handleSelectQuoteToken = async (token: IToken) => {
    if (compareString(quoteToken?.address, token?.address)) {
      return;
    }

    setQuoteToken(token);
    change('quoteToken', token);
    router.replace(
      `${ROUTE_PATH.SWAP_V2}?from_token=${router?.query?.from_token || ''}&to_token=${
        token.address
      }`,
    );
  };

  const onChangeTransferType = async () => {
    if (loading || isSwitching) {
      return;
    }
    setIsSwitching(true);
    change('baseAmount', values?.quoteAmount);
    change('quoteAmount', values?.baseAmount);

    setBaseToken(quoteToken);
    setQuoteToken(baseToken);
    change('baseToken', quoteToken);
    change('quoteToken', baseToken);
    setBaseBalance(quoteBalance);
    setQuoteBalance(baseBalance);
    setAmountBaseTokenApproved(amountQuoteTokenApproved);
    setAmountQuoteTokenApproved(amountBaseTokenApproved);
    router.replace(
      `${ROUTE_PATH.SWAP_V2}?from_token=${router?.query?.to_token || ''}&to_token=${
        router?.query?.from_token || ''
      }`,
    );

    try {
      if (baseToken?.address && quoteToken?.address) {
        if (Number(exchangeRate)) {
          setExchangeRate(new BigNumber(1).div(exchangeRate).toString());
        }

        const routes = await getSwapRoutesInfo(
          quoteToken?.address,
          baseToken?.address,
        );

        onBaseAmountChange({
          amount: values?.quoteAmount,
          tokenIn: quoteToken,
          tokenOut: baseToken,
          swapRoutes: routes,
        });
      }

      if (quoteToken) {
        const [_fromTokens] = await Promise.all([
          fetchFromTokens(quoteToken?.address),
        ]);
        if (_fromTokens) {
          setQuoteTokensList(camelCaseKeys(_fromTokens));
          if (baseToken) {
            const findIndex = _fromTokens.findIndex((v) =>
              compareString(v.address, baseToken.address),
            );

            if (findIndex < 0) {
              setQuoteToken(null);
              change('quoteToken', null);
            }
          }
        }
      }
    } catch (error) {
      throw error;
    } finally {
      setIsSwitching(false);
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
      if (new BigNumber(_amount).gt(baseBalance)) {
        return `Insufficient balance.`;
      }

      return undefined;
    },
    [values.baseAmount],
  );

  const validateQuoteAmount = useCallback(() => {
    return undefined;
  }, [values.quoteAmount]);

  const onChangeValueBaseAmount = (amount: any) => {
    onBaseAmountChange({
      amount,
      tokenIn: baseToken,
      tokenOut: quoteToken,
      swapRoutes: swapRoutes,
    });
  };

  const handleBaseAmountChange = async ({
    amount,
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

      const estimateAmountOut = await calculateBestRoute(amount);

      const rate = new BigNumber(amount)
        .div(estimateAmountOut)
        .decimalPlaces(tokenIn?.decimal || 18);

      setExchangeRate(rate.toString());
      change('quoteAmount', estimateAmountOut);
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

  const calculateBestRoute = async (amount: any) => {
    const promises = swapRoutes.map(route => {
      const addresses = route?.pathTokens?.map((token: IToken) => token.address);
      const fees = route?.pathPairs?.map((pair: any) => Number(pair.fee));

      const params: IEstimateSwapERC20Token = {
        addresses: addresses,
        amount: amount,
        fees: fees
      };
      return getEstimateSwap(params);
    });

    const res = await Promise.all(promises);

    const result = Math.max(...res);

    const indexBestRoute = res.indexOf(result);
    const bestRoute = swapRoutes[indexBestRoute];

    change('bestRoute', bestRoute);

    return result;
  }

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

  const renderRoutePath = () => {
    return (
      <Flex
        direction={'column'}
        alignItems={'flex-start'}
        fontSize={'xs'}
        gap={2}
        mt={2}
      >
        <Flex gap={1} alignItems={'center'}>
          <img
            src={
              'https://cdn.trustless.computer/upload/1683642593326956421-1683642593-route.svg'
            }
            alt={'router-icon'}
          />
          <Text className={'router-text'}>Auto Router</Text>
        </Flex>
        <Flex justifyContent={'space-between'} w={'100%'} color={'#FFFFFF'} gap={2}>
          <Flex gap={2} alignItems={'center'}>
            <img
              // width={25}
              // height={25}
              src={
                baseToken?.thumbnail ||
                tokenIcons?.[baseToken?.symbol?.toLowerCase()] ||
                TOKEN_ICON_DEFAULT
              }
              alt={baseToken?.thumbnail || 'default-icon'}
              className={'avatar'}
            />
            {!baseToken?.thumbnail && <Text>{baseToken?.symbol}</Text>}
          </Flex>
          <Flex gap={2} flex={1} alignItems={'center'}>
            <Box className={'dot-line'}></Box>
          </Flex>
          {swapRoutes?.length > 1 && (
            <>
              {(compareString(baseToken?.address, WBTC_ADDRESS) &&
                compareString(quoteToken?.address, GM_ADDRESS)) ||
              (compareString(baseToken?.address, GM_ADDRESS) &&
                compareString(quoteToken?.address, WBTC_ADDRESS)) ? (
                <img
                  // width={25}
                  // height={25}
                  src={
                    'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png'
                  }
                  alt={'eth-icon'}
                  className={'avatar'}
                />
              ) : (
                <img
                  // width={25}
                  // height={25}
                  src={'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png'}
                  alt={'wbtc-icon'}
                  className={'avatar'}
                />
              )}
              <Flex flex={1} alignItems={'center'}>
                <Box className={'dot-line'}></Box>
              </Flex>
            </>
          )}
          <Flex gap={2} alignItems={'center'}>
            <img
              // width={25}
              // height={25}
              src={
                quoteToken?.thumbnail ||
                tokenIcons?.[quoteToken?.symbol?.toLowerCase()] ||
                TOKEN_ICON_DEFAULT
              }
              alt={quoteToken?.thumbnail || 'default-icon'}
              className={'avatar'}
            />
            {!quoteToken?.thumbnail && <Text>{quoteToken?.symbol}</Text>}
          </Flex>
        </Flex>
      </Flex>
    );
  };

  return (
    <form onSubmit={onSubmit} style={{ height: '100%' }}>
      <HorizontalItem
        label={<Text fontSize={'md'} color={'#B1B5C3'}></Text>}
        value={
          <Flex gap={1}>
            <InfoTooltip label={'History'}>
              <Center
                w={'40px'}
                h={'40px'}
                borderRadius={'50%'}
                bgColor={'#353945'}
                cursor={'pointer'}
                onClick={() => router.push(ROUTE_PATH.SWAP_HISTORY)}
              >
                <BsListCheck color="#FFFFFF" fontSize={'20px'} />
              </Center>
            </InfoTooltip>
            <SlippageSettingButton />
          </Flex>
        }
      />
      <InputWrapper
        className={cx(styles.inputAmountWrap, styles.inputBaseAmountWrap)}
        theme="light"
        label={
          <Text fontSize={px2rem(14)} color={'#FFFFFF'}>
            Swap from
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
      <Box mt={4} />
      <Flex justifyContent={'center'}>
        <Center
          onClick={onChangeTransferType}
          w={'40px'}
          h={'40px'}
          borderRadius={'50%'}
          cursor={'pointer'}
          p={2}
          bgColor={'#353945'}
        >
          <RiArrowUpDownLine color="#FFFFFF" fontSize={'20px'} />
        </Center>
      </Flex>
      <Box mt={4} />
      <InputWrapper
        className={cx(styles.inputAmountWrap, styles.inputQuoteAmountWrap)}
        theme="light"
        label={
          <Text fontSize={px2rem(14)} color={'#FFFFFF'}>
            Swap to
          </Text>
        }
        rightLabel={
          quoteToken && (
            <Flex gap={2} fontSize={px2rem(14)} color={'#FFFFFF'}>
              <Flex gap={1} alignItems={'center'}>
                Balance:
                <TokenBalance
                  token={quoteToken}
                  onBalanceChange={(_amount) => setQuoteBalance(_amount)}
                />
                {quoteToken?.symbol}
              </Flex>
            </Flex>
          )
        }
      >
        <Flex gap={4} direction={'column'}>
          <Field
            name="quoteAmount"
            // placeholder={`0 ${revertCoin[1].symbol}`}
            children={FieldAmount}
            validate={composeValidators(required, validateQuoteAmount)}
            // fieldChanged={onChangeValueQuoteAmount}
            disabled={true}
            // placeholder={"Enter number of tokens"}
            decimals={quoteToken?.decimal || 18}
            className={cx(styles.inputAmount)}
            prependComp={
              <FilterButton
                data={quoteTokensList}
                commonData={quoteTokensList.slice(0, 3)}
                handleSelectItem={handleSelectQuoteToken}
                parentClose={close}
                value={quoteToken}
              />
            }
            // hideError={true}
            borderColor={'#353945'}
          />
        </Flex>
      </InputWrapper>
      <Box mt={1}>
        <HorizontalItem
          label={
            <Text
              fontSize={'sm'}
              fontWeight={'medium'}
              color={'rgba(255, 255, 255, 0.7)'}
            >
              Fee: {swapFee * (swapRoutes?.length || 1)}%
            </Text>
          }
        />
        <HorizontalItem
          label={
            <Flex
              fontSize={'sm'}
              fontWeight={'medium'}
              color={'rgba(255, 255, 255, 0.7)'}
            >
              Reward: +0.1TM
            </Flex>
          }
        />
      </Box>
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
      {baseToken && quoteToken && <>{renderRoutePath()}</>}
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
              Your TC balance is insufficient. Buy more TC{' '}
              <Link
                href={TRUSTLESS_GASSTATION}
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
      <Box mt={8} />
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
            containerConfig={{ flex: 1 }}
            loadingText={submitting ? 'Processing' : ' '}
            processInfo={{
              id: transactionType.createPoolApprove,
            }}
          >
            SWAP
          </FiledButton>
        )}
      </WrapperConnected>
    </form>
  );
});

const TradingForm = () => {
  const refForm = useRef<any>();
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useAppDispatch();
  const { account } = useWeb3React();
  const { run: swapToken } = useContractOperation<ISwapERC20TokenParams, boolean>({
    operation: useSwapERC20Token,
  });
  const slippage = useAppSelector(selectPnftExchange).slippage;
  const { mobileScreen } = useWindowSize();
  const { call: getEstimateSwap } = useEstimateSwapERC20Token();

  useEffect(() => {
    return () => {
      dispatch(updateCurrentTransaction(null));
    };
  }, []);

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
    const { baseToken, quoteToken, baseAmount, quoteAmount, swapRoutes, bestRoute } = values;

    try {
      setSubmitting(true);
      dispatch(
        updateCurrentTransaction({
          status: TransactionStatus.info,
          id: transactionType.createPoolApprove,
        }),
      );

      const addresses = bestRoute?.pathTokens?.map((token: IToken) => token.address);
      const fees = bestRoute?.pathPairs?.map((pair: any) => Number(pair.fee));

      const amountOutMin = new BigNumber(quoteAmount)
        .multipliedBy(100 - slippage)
        .dividedBy(100)
        .decimalPlaces(quoteToken?.decimal || 18)
        .toString();

      const data = {
        addresses: addresses,
        fees: fees,
        address: account,
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

export default TradingForm;
