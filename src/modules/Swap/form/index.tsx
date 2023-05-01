/* eslint-disable react/no-children-prop */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { transactionType } from '@/components/Swap/alertInfoProcessing/types';
import FiledButton from '@/components/Swap/button/filedButton';
import FilterButton from '@/components/Swap/filterToken';
import FieldAmount from '@/components/Swap/form/fieldAmount';
import InputWrapper from '@/components/Swap/form/inputWrapper';
import HorizontalItem from '@/components/Swap/horizontalItem';
import SlippageSettingButton from '@/components/Swap/slippageSetting/button';
import WrapperConnected from '@/components/WrapperConnected';
import { UNIV2_ROUTER_ADDRESS } from '@/configs';
import {
  BRIDGE_SUPPORT_TOKEN,
  TRUSTLESS_BRIDGE,
  TRUSTLESS_FAUCET,
} from '@/constants/common';
import { NULL_ADDRESS } from '@/constants/url';
import { AssetsContext } from '@/contexts/assets-context';
import useGetPair from '@/hooks/contract-operations/swap/useGetPair';
import useGetReserves from '@/hooks/contract-operations/swap/useReserves';
import useSwapERC20Token from '@/hooks/contract-operations/swap/useSwapERC20Token';
import useApproveERC20Token from '@/hooks/contract-operations/token/useApproveERC20Token';
import useBalanceERC20Token from '@/hooks/contract-operations/token/useBalanceERC20Token';
import useIsApproveERC20Token from '@/hooks/contract-operations/token/useIsApproveERC20Token';
import { IToken } from '@/interfaces/token';
import { TransactionStatus } from '@/interfaces/walletTransaction';
import { getSwapTokens } from '@/services/token-explorer';
import { useAppDispatch, useAppSelector } from '@/state/hooks';
import {
  requestReload,
  requestReloadRealtime,
  selectPnftExchange,
  updateCurrentTransaction,
} from '@/state/pnftExchange';
import { getIsAuthenticatedSelector, getUserSelector } from '@/state/user/selector';
import { camelCaseKeys, compareString, formatCurrency } from '@/utils';
import { isDevelop } from '@/utils/commons';
import { composeValidators, required } from '@/utils/formValidate';
import { formatEthPrice } from '@/utils/format';
import px2rem from '@/utils/px2rem';
import { showError } from '@/utils/toast';
import { Box, Flex, Text, forwardRef } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import cx from 'classnames';
import { isEmpty } from 'lodash';
import debounce from 'lodash/debounce';
import Link from 'next/link';
import {
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Field, Form, useForm, useFormState } from 'react-final-form';
import toast from 'react-hot-toast';
import { RiArrowUpDownLine } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import styles from './styles.module.scss';

const LIMIT_PAGE = 50;
const FEE = 3;

export const MakeFormSwap = forwardRef((props, ref) => {
  const { onSubmit, submitting } = props;
  const [loading, setLoading] = useState(false);
  const [baseToken, setBaseToken] = useState<any>();
  const [quoteToken, setQuoteToken] = useState<any>();
  const [isApproveBaseToken, setIsApproveBaseToken] = useState(true);
  const [isApproveQuoteToken, setIsApproveQuoteToken] = useState(true);
  const [tokensList, setTokensList] = useState<IToken[]>([]);
  const [baseTokensList, setBaseTokensList] = useState<IToken[]>([]);
  const [quoteTokensList, setQuoteTokensList] = useState<IToken[]>([]);
  const { call: isApproved } = useIsApproveERC20Token();
  const { call: tokenBalance } = useBalanceERC20Token();
  const { call: approveToken } = useApproveERC20Token();
  const { call: getPair } = useGetPair();
  const { call: getReserves } = useGetReserves();
  const [baseBalance, setBaseBalance] = useState('0');
  const [quoteBalance, setQuoteBalance] = useState('0');
  const [pairAddress, setPairAddress] = useState<string>(NULL_ADDRESS);
  const [baseReserve, setBaseReserve] = useState('0');
  const [quoteReserve, setQuoteReserve] = useState('0');
  const { juiceBalance } = useContext(AssetsContext);
  const isAuthenticated = useSelector(getIsAuthenticatedSelector);
  const dispatch = useDispatch();
  const [isSwitching, setIsSwitching] = useState(false);
  const [isChangeBaseToken, setIsChangeBaseToken] = useState(false);
  const [isChangeQuoteToken, setIsChangeQuoteToken] = useState(false);

  // console.log('isSwitching', isSwitching);
  // console.log('baseReserve', baseReserve);
  // console.log('quoteReserve', quoteReserve);
  // console.log('quoteTokensList', quoteTokensList);
  // console.log('======');

  const { values } = useFormState();
  const { change, restart } = useForm();
  const btnDisabled = loading || !baseToken || !quoteToken;

  const onBaseAmountChange = useCallback(
    debounce((p) => handleBaseAmountChange(p), 1000),
    [],
  );

  const onQuoteAmountChange = useCallback(
    debounce((p) => handleQuoteAmountChange(p), 1000),
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
    if (baseToken?.address && quoteToken?.address) {
      getPairAddress();
    } else {
      setPairAddress(NULL_ADDRESS);
    }
  }, [baseToken?.address, quoteToken?.address]);

  useEffect(() => {
    if (
      pairAddress &&
      baseToken &&
      quoteToken &&
      !compareString(pairAddress, NULL_ADDRESS)
    ) {
      getReservesInfo();
    }
  }, [pairAddress]);

  const fetchTokens = async (page = 1, isFetchMore = false) => {
    try {
      setLoading(true);
      const res = await getSwapTokens({
        limit: LIMIT_PAGE,
        page: page,
        is_test: isDevelop() ? '1' : '',
      });
      setTokensList(camelCaseKeys(res));
      setBaseTokensList(camelCaseKeys(res));
      setQuoteTokensList(camelCaseKeys(res));
    } catch (err: unknown) {
      console.log('Failed to fetch tokens owned');
    } finally {
      setLoading(false);
    }
  };

  const fetchFromTokens = async (from_token?: string) => {
    try {
      const res = await getSwapTokens({
        limit: LIMIT_PAGE,
        page: 1,
        is_test: isDevelop() ? '1' : '',
        from_token: from_token,
      });
      return res;
    } catch (err: unknown) {
      console.log('Failed to fetch tokens owned');
    } finally {
    }
  };

  const getReservesInfo = async () => {
    const { token0, token1 } =
      baseToken.address.toLowerCase() < quoteToken.address.toLowerCase()
        ? { token0: baseToken, token1: quoteToken }
        : { token0: quoteToken, token1: baseToken };
    try {
      const response = await getReserves({
        address: pairAddress,
      });

      const { _reserve0, _reserve1 } = response;
      let _baseReserve = '';
      let _quoteReserve = '';

      if (compareString(token0?.address, baseToken?.address)) {
        _baseReserve = formatEthPrice(_reserve0);
        _quoteReserve = formatEthPrice(_reserve1);
      } else {
        _quoteReserve = formatEthPrice(_reserve0);
        _baseReserve = formatEthPrice(_reserve1);
      }

      setBaseReserve(_baseReserve);
      setQuoteReserve(_quoteReserve);

      if (isChangeBaseToken) {
        setIsChangeBaseToken(false);
        onBaseAmountChange({
          amount: values?.baseAmount,
          baseReserve: _baseReserve,
          quoteReserve: _quoteReserve,
        });
      } else if (isChangeQuoteToken) {
        setIsChangeQuoteToken(false);
        onQuoteAmountChange({
          amount: values?.quoteAmount,
          baseReserve: _baseReserve,
          quoteReserve: _quoteReserve,
        });
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const getPairAddress = async () => {
    const { token0, token1 } =
      baseToken.address.toLowerCase() < quoteToken.address.toLowerCase()
        ? { token0: baseToken, token1: quoteToken }
        : { token0: quoteToken, token1: baseToken };
    try {
      const response = await getPair({
        tokenA: token0,
        tokenB: token1,
      });
      setPairAddress(response);
    } catch (error) {
      console.log('error', error);
    }
  };

  const checkTokenApprove = async (token: IToken) => {
    try {
      const response = await isApproved({
        erc20TokenAddress: token.address,
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
      const response = await approveToken({
        erc20TokenAddress: token.address,
        address: UNIV2_ROUTER_ADDRESS,
      });
    } catch (error) {
      console.log('error', error);
    } finally {
      dispatch(updateCurrentTransaction(null));
    }
  };

  const handleSelectBaseToken = async (token: IToken) => {
    if (compareString(baseToken?.address, token?.address)) {
      return;
    }
    setIsChangeBaseToken(true);
    setBaseToken(token);
    change('baseToken', token);
    try {
      const [_isApprove, _tokenBalance, _fromTokens] = await Promise.all([
        checkTokenApprove(token),
        getTokenBalance(token),
        fetchFromTokens(token?.address),
      ]);
      setIsApproveBaseToken(_isApprove);
      setBaseBalance(_tokenBalance);
      if (_fromTokens) {
        setQuoteTokensList(camelCaseKeys(_fromTokens));
        if (quoteToken) {
          const findIndex = _fromTokens.findIndex((v) =>
            compareString(v.address, quoteToken.address),
          );

          if (findIndex < 0) {
            setQuoteToken(null);
            change('quoteToken', null);
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
    setIsChangeQuoteToken(true);

    setQuoteToken(token);
    change('quoteToken', token);
    try {
      const [_isApprove, _tokenBalance] = await Promise.all([
        checkTokenApprove(token),
        getTokenBalance(token),
        fetchFromTokens(token?.address),
      ]);
      setIsApproveQuoteToken(_isApprove);
      setQuoteBalance(_tokenBalance);
    } catch (error) {
      throw error;
    }
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
    setIsApproveBaseToken(isApproveQuoteToken);
    setIsApproveQuoteToken(isApproveBaseToken);
    setBaseReserve(quoteReserve);
    setQuoteReserve(baseReserve);

    try {
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
      if (Number(_amount) > Number(baseBalance)) {
        return `Max amount is ${formatCurrency(baseBalance)}`;
      }

      return undefined;
    },
    [values.baseAmount],
  );

  const validateQuoteAmount = useCallback(() => {
    return undefined;
  }, [values.quoteAmount]);

  const getAmountOut = (
    amountIn: BigNumber,
    reserveIn: BigNumber,
    reserveOut: BigNumber,
  ): BigNumber => {
    const amountInWithFee = amountIn.multipliedBy(1000 - FEE * 10);
    const numerator = amountInWithFee.multipliedBy(reserveOut);
    const denominator = reserveIn.multipliedBy(1000).plus(amountInWithFee);
    const amountOut = numerator.div(denominator);
    return amountOut;
  };

  const onChangeValueBaseAmount = (amount: any) => {
    onBaseAmountChange({
      amount,
      baseReserve,
      quoteReserve,
    });
  };

  const handleBaseAmountChange = ({
    amount,
    baseReserve,
    quoteReserve,
  }: {
    amount: any;
    baseReserve: any;
    quoteReserve: any;
  }) => {
    if (isNaN(Number(amount))) return;
    const amountIn = new BigNumber(amount);
    const reserveIn = new BigNumber(baseReserve);
    const reserveOut = new BigNumber(quoteReserve);
    if (amountIn.lte(0) || reserveIn.lte(0) || reserveOut.lte(0)) {
      return;
    }
    const quoteAmount = getAmountOut(amountIn, reserveIn, reserveOut);

    change('quoteAmount', quoteAmount.toString());
  };

  const onChangeValueQuoteAmount = (amount: any) => {
    onQuoteAmountChange({
      amount,
      baseReserve,
      quoteReserve,
    });
  };

  const handleQuoteAmountChange = ({
    amount,
    baseReserve,
    quoteReserve,
  }: {
    amount: any;
    baseReserve: any;
    quoteReserve: any;
  }) => {
    if (isNaN(Number(amount))) return;
    const amountIn = new BigNumber(amount);
    const reserveIn = new BigNumber(quoteReserve);
    const reserveOut = new BigNumber(baseReserve);
    if (amountIn.lte(0) || reserveIn.lte(0) || reserveOut.lte(0)) {
      return;
    }
    const baseAmount = getAmountOut(amountIn, reserveIn, reserveOut);

    change('baseAmount', baseAmount.toString());
  };

  const handleChangeMaxBaseAmount = () => {
    change('baseAmount', baseBalance);
  };

  const handleChangeMaxQuoteAmount = () => {
    change('quoteAmount', quoteBalance);
  };

  const onApprove = async () => {
    try {
      setLoading(true);

      await requestApproveToken(baseToken);
      setIsApproveBaseToken(true);

      toast.success('Transaction has been created. Please wait for few minutes.');
    } catch (err) {
      showError({
        message:
          (err as Error).message || 'Something went wrong. Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} style={{ height: '100%' }}>
      <HorizontalItem
        label={<Text fontSize={'md'} color={'#B1B5C3'}></Text>}
        value={<SlippageSettingButton></SlippageSettingButton>}
      />
      <InputWrapper
        className={cx(styles.inputAmountWrap, styles.inputBaseAmountWrap)}
        theme="light"
        label={<Text fontSize={px2rem(16)}>Swap from</Text>}
        rightLabel={
          baseToken && (
            <Flex gap={1} fontSize={px2rem(16)}>
              <Text>
                Balance: {formatCurrency(baseBalance)} {baseToken?.symbol}
              </Text>
              <Text
                cursor={'pointer'}
                color={'#3385FF'}
                onClick={handleChangeMaxBaseAmount}
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
            decimals={baseToken?.decimals || 18}
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
            borderColor={'#5B5B5B'}
          />
        </Flex>
      </InputWrapper>
      <Flex justifyContent={'center'}>
        <Box
          onClick={onChangeTransferType}
          className="btn-transfer"
          cursor={'pointer'}
          p={2}
          // bgColor={'#B1B5C3'}
          borderRadius={'8px'}
        >
          <RiArrowUpDownLine color="#3385FF" />
        </Box>
      </Flex>

      <InputWrapper
        className={cx(styles.inputAmountWrap, styles.inputQuoteAmountWrap)}
        theme="light"
        label={<Text fontSize={px2rem(16)}>Swap to</Text>}
        rightLabel={
          quoteToken && (
            <Flex gap={1} fontSize={px2rem(16)}>
              <Text>
                Balance: {formatCurrency(quoteBalance)} {quoteToken?.symbol}
              </Text>
              <Text
                cursor={'pointer'}
                color={'#3385FF'}
                onClick={handleChangeMaxQuoteAmount}
              >
                MAX
              </Text>
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
            fieldChanged={onChangeValueQuoteAmount}
            disabled={submitting}
            // placeholder={"Enter number of tokens"}
            decimals={quoteToken?.decimals || 18}
            className={cx(styles.inputAmount, styles.collateralAmount)}
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
            borderColor={'#5B5B5B'}
          />
        </Flex>
      </InputWrapper>
      {!isEmpty(baseToken) && !isEmpty(quoteToken) && (
        <HorizontalItem
          label={
            <Text fontSize={'xs'} fontWeight={'medium'} color={'#23262F'}>
              1 {quoteToken?.symbol} =&nbsp;
              {formatCurrency(
                new BigNumber(baseReserve).dividedBy(quoteReserve).toNumber(),
              )}
              &nbsp;{baseToken?.symbol}
            </Text>
          }
        />
      )}
      <HorizontalItem
        label={
          <Text fontSize={'xs'} fontWeight={'medium'} color={'#23262F'}>
            Fee: {FEE}%
          </Text>
        }
      />
      {isAuthenticated && new BigNumber(juiceBalance || 0).lte(0) && (
        <Text fontSize="xs" color="brand.warning.400" textAlign={'left'}>
          Your TC balance is insufficient. You can receive free TC on our faucet site{' '}
          <Link
            href={TRUSTLESS_FAUCET}
            target={'_blank'}
            style={{ textDecoration: 'underline' }}
          >
            here
          </Link>
          .
        </Text>
      )}
      {isAuthenticated &&
        baseToken &&
        BRIDGE_SUPPORT_TOKEN.includes(baseToken?.symbol) &&
        new BigNumber(baseBalance || 0).lte(0) && (
          <Text fontSize="xs" color="brand.warning.400" textAlign={'left'}>
            Insufficient {baseToken?.symbol} balance! Consider swapping your{' '}
            {baseToken?.symbol?.replace('W', '')} to trustless network{' '}
            <Link
              href={TRUSTLESS_BRIDGE}
              target={'_blank'}
              style={{ textDecoration: 'underline' }}
            >
              here
            </Link>
            .
          </Text>
        )}
      <WrapperConnected className={styles.submitButton}>
        {isApproveBaseToken ? (
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
              id: transactionType.swapToken,
            }}
          >
            SWAP
          </FiledButton>
        ) : (
          <FiledButton
            isLoading={loading}
            isDisabled={loading}
            loadingText="Processing"
            btnSize={'h'}
            onClick={onApprove}
            processInfo={{
              id: transactionType.createPoolApprove,
            }}
          >
            APPROVE USE OF {baseToken?.symbol}
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
  const { call: swapToken } = useSwapERC20Token();
  const user = useSelector(getUserSelector);
  const slippage = useAppSelector(selectPnftExchange).slippage;

  const handleSubmit = async (values: any) => {
    const { baseToken, quoteToken, baseAmount, quoteAmount } = values;
    console.log('handleSubmit', values);
    try {
      setSubmitting(true);
      dispatch(
        updateCurrentTransaction({
          status: TransactionStatus.info,
          id: transactionType.createPool,
        }),
      );

      const amountOutMin = new BigNumber(quoteAmount)
        .multipliedBy(100 - slippage)
        .dividedBy(100)
        .decimalPlaces(18)
        .toString();

      const data = {
        addresses: [baseToken.address, quoteToken.address],
        address: user?.walletAddress,
        amount: baseAmount,
        amountOutMin: amountOutMin,
      };

      const response = await swapToken(data);

      toast.success('Transaction has been created. Please wait for few minutes.');
      refForm.current?.reset();
      dispatch(requestReload());
      dispatch(requestReloadRealtime());
    } catch (err) {
      showError({
        message:
          (err as Error).message || 'Something went wrong. Please try again later.',
      });
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
