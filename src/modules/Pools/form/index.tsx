/* eslint-disable react/no-children-prop */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import FiledButton from '@/components/Swap/button/filedButton';
import FilterButton from '@/components/Swap/filterToken';
import FieldAmount from '@/components/Swap/form/fieldAmount';
import InputWrapper from '@/components/Swap/form/inputWrapper';
import WrapperConnected from '@/components/WrapperConnected';
import { UNIV2_ROUTER_ADDRESS } from '@/configs';
import { NULL_ADDRESS } from '@/constants/url';
// import pairsMock from '@/dataMock/tokens.json';
import { transactionType } from '@/components/Swap/alertInfoProcessing/types';
import { ROUTE_PATH } from '@/constants/route-path';
import { LIQUID_PAIRS } from '@/constants/storage-key';
import useAddLiquidity from '@/hooks/contract-operations/pools/useAddLiquidity';
import useGetPair from '@/hooks/contract-operations/swap/useGetPair';
import useGetReserves from '@/hooks/contract-operations/swap/useReserves';
import useApproveERC20Token from '@/hooks/contract-operations/token/useApproveERC20Token';
import useBalanceERC20Token from '@/hooks/contract-operations/token/useBalanceERC20Token';
import useIsApproveERC20Token from '@/hooks/contract-operations/token/useIsApproveERC20Token';
import useSupplyERC20Liquid from '@/hooks/contract-operations/token/useSupplyERC20Liquid';
import { IToken } from '@/interfaces/token';
import { TransactionStatus } from '@/interfaces/walletTransaction';
import { getTokens } from '@/services/token-explorer';
import { useAppDispatch } from '@/state/hooks';
import {
  requestReload,
  requestReloadRealtime,
  updateCurrentTransaction,
} from '@/state/pnftExchange';
import {
  camelCaseKeys,
  compareString,
  formatCurrency,
  sortAddressPair,
} from '@/utils';
import { isDevelop } from '@/utils/commons';
import { composeValidators, required } from '@/utils/formValidate';
import { formatAmountBigNumber } from '@/utils/format';
import px2rem from '@/utils/px2rem';
import { showError } from '@/utils/toast';
import {
  Box,
  Flex,
  Stat,
  StatHelpText,
  StatNumber,
  Text,
  forwardRef,
} from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import cx from 'classnames';
import { isEmpty } from 'lodash';
import { useRouter } from 'next/router';
import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Field, Form, useForm, useFormState } from 'react-final-form';
import toast from 'react-hot-toast';
import { BsPlus } from 'react-icons/bs';
import { useDispatch } from 'react-redux';
import { ScreenType } from '..';
import styles from './styles.module.scss';

const LIMIT_PAGE = 50;

export const MakeFormSwap = forwardRef((props, ref) => {
  const { onSubmit, submitting, fromAddress, toAddress } = props;
  const [loading, setLoading] = useState(false);
  const [baseToken, setBaseToken] = useState<IToken>();
  const [quoteToken, setQuoteToken] = useState<IToken>();
  const [isApproveBaseToken, setIsApproveBaseToken] = useState<boolean>(true);
  const [isApproveQuoteToken, setIsApproveQuoteToken] = useState(true);
  const [tokensList, setTokensList] = useState<IToken[]>([]);
  const { call: isApproved } = useIsApproveERC20Token();
  const { call: tokenBalance } = useBalanceERC20Token();
  const { call: approveToken } = useApproveERC20Token();
  const { call: getPair } = useGetPair();
  const { call: getReserves } = useGetReserves();
  const { call: getSupply } = useSupplyERC20Liquid();
  const [baseBalance, setBaseBalance] = useState('0');
  const [quoteBalance, setQuoteBalance] = useState('0');
  const [pairAddress, setPairAddress] = useState(NULL_ADDRESS);
  const [percentPool, setPercentPool] = useState('0');
  const [perPrice, setPerPrice] = useState<{
    _reserve0: string;
    _reserve1: string;
  }>({
    _reserve0: '-',
    _reserve1: '-',
  });
  const router = useRouter();
  const type = router.query.type;
  const isScreenAdd = compareString(type, ScreenType.add);

  const isPaired = !compareString(pairAddress, NULL_ADDRESS);

  const dispatch = useDispatch();
  const { values } = useFormState();
  const { change, restart } = useForm();
  const btnDisabled = loading;

  useImperativeHandle(ref, () => {
    return {
      reset: reset,
    };
  });

  const reset = async () => {
    restart({});
  };

  useEffect(() => {
    fetchTokens();
  }, []);

  useEffect(() => {
    checkPair();
  }, [baseToken, quoteToken]);

  const checkPair = async () => {
    if (!baseToken?.address || !quoteToken?.address) {
      return;
    }

    try {
      const response = await getPair({
        tokenA: baseToken,
        tokenB: quoteToken,
      });

      if (!compareString(response, NULL_ADDRESS)) {
        const [resReserve, resSupply] = await Promise.all([
          getReserves({
            address: response,
          }),
          getSupply({
            liquidAddress: response,
          }),
        ]);

        if (Number(resSupply.totalSupply) !== 0) {
          setPercentPool(
            new BigNumber(resSupply.ownerSupply)
              .dividedBy(resSupply.totalSupply)
              .multipliedBy(100)
              .toString(),
          );
        }

        if (!isScreenAdd) {
          setBaseBalance(
            formatAmountBigNumber(resReserve._reserve0, baseToken.decimal),
          );
          setQuoteBalance(
            formatAmountBigNumber(resReserve._reserve1, quoteToken.decimal),
          );
        }

        setPerPrice(resReserve);
      } else {
        setPerPrice({
          _reserve0: '-',
          _reserve1: '-',
        });
      }

      setPairAddress(response);
    } catch (error) {}
  };

  useEffect(() => {
    if (fromAddress && tokensList.length > 0) {
      const findFromToken = tokensList.find((v) =>
        compareString(v.address, fromAddress),
      );

      if (findFromToken) {
        handleSelectBaseToken(findFromToken);
      }
    }
  }, [fromAddress, tokensList.length]);

  useEffect(() => {
    if (toAddress && tokensList.length > 0) {
      const findFromToken = tokensList.find((v) =>
        compareString(v.address, toAddress),
      );

      if (findFromToken) {
        handleSelectQuoteToken(findFromToken);
      }
    }
  }, [toAddress, tokensList.length]);

  const fetchTokens = async (page = 1, _isFetchMore = false) => {
    try {
      setLoading(true);
      const res = await getTokens({
        limit: LIMIT_PAGE * 10,
        page: page,
      });
      // setTokensList(camelCaseKeys(pairsMock));
      setTokensList(camelCaseKeys(res));
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
      await approveToken({
        erc20TokenAddress: token.address,
        address: UNIV2_ROUTER_ADDRESS,
      });
    } catch (error) {
      throw error;
    } finally {
      dispatch(updateCurrentTransaction(null));
    }
  };

  const handleSelectBaseToken = async (token: IToken) => {
    setBaseToken(token);
    change('baseToken', token);
    try {
      const [_isApprove, _tokenBalance] = await Promise.all([
        checkTokenApprove(token),
        getTokenBalance(token),
      ]);
      setIsApproveBaseToken(_isApprove);
      if (isScreenAdd) {
        setBaseBalance(_tokenBalance);
      }
    } catch (error) {
      throw error;
    }
  };

  const handleSelectQuoteToken = async (token: IToken) => {
    setQuoteToken(token);
    change('quoteToken', token);
    try {
      const [_isApprove, _tokenBalance] = await Promise.all([
        checkTokenApprove(token),
        getTokenBalance(token),
      ]);
      setIsApproveQuoteToken(_isApprove);
      if (isScreenAdd) {
        setQuoteBalance(_tokenBalance);
      }
    } catch (error) {
      throw error;
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

  const validateQuoteAmount = useCallback(
    (_amount: any) => {
      if (Number(_amount) > Number(quoteBalance)) {
        return `Max amount is ${formatCurrency(quoteBalance)}`;
      }
      return undefined;
    },
    [values.quoteAmount],
  );

  const onChangeValueQuoteAmount = (_amount: any) => {
    if (isPaired && baseToken && quoteToken) {
      const tokens = sortAddressPair(quoteToken, quoteToken);
      const findIndex = tokens.findIndex((v) =>
        compareString(v.address, baseToken.address),
      );
      const rate =
        findIndex === 0
          ? new BigNumber(perPrice._reserve0).dividedBy(perPrice._reserve1)
          : new BigNumber(perPrice._reserve1).dividedBy(perPrice._reserve0);
      change('baseAmount', new BigNumber(_amount).multipliedBy(rate).toString());
    }
  };

  const onChangeValueBaseAmount = (_amount: any) => {
    if (isPaired && baseToken && quoteToken) {
      const tokens = sortAddressPair(baseToken, quoteToken);
      const findIndex = tokens.findIndex((v) =>
        compareString(v.address, baseToken.address),
      );
      const rate =
        findIndex === 0
          ? new BigNumber(perPrice._reserve0).dividedBy(perPrice._reserve1)
          : new BigNumber(perPrice._reserve1).dividedBy(perPrice._reserve0);
      change('quoteAmount', new BigNumber(_amount).multipliedBy(rate).toString());
    }
  };

  const handleChangeMaxBaseAmount = () => {
    change('baseAmount', baseBalance);
    onChangeValueBaseAmount(baseBalance);
  };

  const handleChangeMaxQuoteAmount = () => {
    change('quoteAmount', quoteBalance);
    onChangeValueQuoteAmount(quoteBalance);
  };

  const onApprove = async () => {
    try {
      setLoading(true);

      if (!isEmpty(baseToken) && !isApproveBaseToken) {
        await requestApproveToken(baseToken);
        setIsApproveBaseToken(true);
      } else if (!isEmpty(quoteToken) && !isApproveQuoteToken) {
        await requestApproveToken(quoteToken);
        setIsApproveQuoteToken(true);
      }

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

  const renderPricePool = () => {
    if (!baseToken || !quoteToken) {
      return;
    }
    const [token1, token2] = sortAddressPair(baseToken, quoteToken);
    return (
      <Flex className="price-pool-content">
        <Box>
          <Stat>
            <StatNumber>{!isPaired ? '-' : 1}</StatNumber>
            <StatHelpText>{`${token1.symbol} per ${token2.symbol}`}</StatHelpText>
          </Stat>
        </Box>
        <Box>
          <Stat>
            <StatNumber>
              {!isPaired
                ? '-'
                : formatCurrency(
                    new BigNumber(formatAmountBigNumber(perPrice._reserve1))
                      .dividedBy(formatAmountBigNumber(perPrice._reserve0))
                      .toString(),
                  )}
            </StatNumber>
            <StatHelpText>{`${token2.symbol} per ${token1.symbol}`}</StatHelpText>
          </Stat>
        </Box>
        <Box>
          <Stat>
            <StatNumber>{formatCurrency(percentPool)}%</StatNumber>
            <StatHelpText>Share of Pool</StatHelpText>
          </Stat>
        </Box>
      </Flex>
    );
  };

  const isDisabled = !baseToken && !quoteToken;

  return (
    <form onSubmit={onSubmit} style={{ height: '100%' }}>
      <InputWrapper
        className={cx(styles.inputAmountWrap, styles.inputBaseAmountWrap)}
        theme="light"
        label={' '}
        rightLabel={
          !isEmpty(baseToken) && (
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
            disabled={submitting || isDisabled}
            // placeholder={"Enter number of tokens"}
            decimals={baseToken?.decimal || 18}
            className={styles.inputAmount}
            prependComp={
              <FilterButton
                disabled={!isScreenAdd}
                data={tokensList}
                commonData={tokensList.slice(0, 3)}
                handleSelectItem={(_token: IToken) =>
                  router.replace(
                    `${ROUTE_PATH.POOLS}?type=${router?.query?.type}&f=${_token.address}&t=${router?.query?.t}`,
                  )
                }
                parentClose={close}
                value={baseToken}
              />
            }
            borderColor={'#5B5B5B'}
          />
        </Flex>
      </InputWrapper>
      <Flex justifyContent={'center'} mt={6}>
        <Box
          className="btn-transfer"
          p={2}
          border={'1px solid #3385FF'}
          borderRadius={'8px'}
        >
          <BsPlus color="#3385FF" />
        </Box>
      </Flex>

      <InputWrapper
        className={cx(styles.inputAmountWrap, styles.inputQuoteAmountWrap)}
        theme="light"
        label={' '}
        rightLabel={
          !isEmpty(quoteToken) && (
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
            disabled={submitting || isDisabled}
            // placeholder={"Enter number of tokens"}
            decimals={quoteToken?.decimal || 18}
            className={cx(styles.inputAmount, styles.collateralAmount)}
            prependComp={
              <FilterButton
                disabled={!isScreenAdd}
                data={tokensList}
                commonData={tokensList.slice(0, 3)}
                handleSelectItem={(_token: IToken) =>
                  router.replace(
                    `${ROUTE_PATH.POOLS}?type=${router?.query?.type}&f=${router?.query?.f}&t=${_token.address}`,
                  )
                }
                parentClose={close}
                value={quoteToken}
              />
            }
            // hideError={true}
            borderColor={'#5B5B5B'}
          />
        </Flex>
      </InputWrapper>

      {baseToken && quoteToken && (
        <Box className={styles.pricePoolContainer}>
          <Text>Initial prices and pool share</Text>
          {renderPricePool()}
        </Box>
      )}

      <WrapperConnected className={styles.submitButton}>
        {isApproveBaseToken && isApproveQuoteToken ? (
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
              id: transactionType.createPool,
            }}
            style={{ backgroundColor: isScreenAdd ? '#3385FF' : '#BC1756' }}
          >
            {isScreenAdd ? 'CREATE' : 'REMOVE'}
          </FiledButton>
        ) : (
          <FiledButton
            isLoading={loading}
            isDisabled={loading}
            loadingText="Processing"
            btnSize={'h'}
            onClick={onApprove}
            type="button"
            processInfo={{
              id: transactionType.createPoolApprove,
            }}
          >
            APPROVE USE OF{' '}
            {!isApproveBaseToken ? baseToken?.symbol : quoteToken?.symbol}
          </FiledButton>
        )}
      </WrapperConnected>
    </form>
  );
});

const CreateMarket = ({
  fromAddress,
  toAddress,
  type,
}: {
  fromAddress?: any;
  toAddress?: any;
  type?: any;
}) => {
  const refForm = useRef<any>();
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useAppDispatch();
  const { call: addLiquidity } = useAddLiquidity();

  const { call: getPair } = useGetPair();
  const { call: getReserves } = useGetReserves();
  const { call: getSupply } = useSupplyERC20Liquid();

  const checkPair = async (baseToken: IToken, quoteToken: IToken) => {
    try {
      const response = await getPair({
        tokenA: baseToken,
        tokenB: quoteToken,
      });
      const [resReserve, resSupply] = await Promise.all([
        getReserves({
          address: response,
        }),
        getSupply({
          liquidAddress: response,
        }),
      ]);

      const _pairs = localStorage.getItem(LIQUID_PAIRS);
      let __pairs: IToken[] = [];

      if (_pairs) {
        __pairs = JSON.parse(_pairs) || ([] as IToken[]);
      }
      const findIndex = __pairs.findIndex((v: IToken) =>
        compareString(v.address, response),
      );
      const extraInfo = {
        name: `${baseToken.symbol}-${quoteToken.symbol}`,
        symbol: `${baseToken.symbol}-${quoteToken.symbol}`,
        address: response,
        total_supply: resSupply.totalSupply,
        owner_supply: resSupply.ownerSupply,
        from_address: baseToken.address,
        from_balance: resReserve._reserve0,
        to_address: quoteToken.address,
        to_balance: resReserve._reserve1,
      };
      if (findIndex > -1) {
        __pairs[findIndex] = {
          ...__pairs[findIndex],
          ...extraInfo,
        };
      } else {
        __pairs.push({
          ...baseToken,
          ...extraInfo,
        });
      }
      localStorage.setItem(LIQUID_PAIRS, JSON.stringify(__pairs));
    } catch (error) {}
  };

  const handleSubmit = async (values: any) => {
    console.log('handleSubmit', values);
    const { baseToken, quoteToken, baseAmount, quoteAmount } = values;
    try {
      setSubmitting(true);
      dispatch(
        updateCurrentTransaction({
          status: TransactionStatus.info,
          id: transactionType.createPool,
        }),
      );

      const [token0, token1] = sortAddressPair(baseToken, quoteToken);

      const { amount0, amount1 } =
        baseToken.address.toLowerCase() < quoteToken.address.toLowerCase()
          ? { amount0: baseAmount, amount1: quoteAmount }
          : { amount0: quoteAmount, amount1: baseAmount };

      const data = {
        tokenA: token0?.address,
        tokenB: token1?.address,
        amountAMin: '0',
        amountADesired: amount0,
        amountBDesired: amount1,
        amountBMin: '0',
      };

      await addLiquidity(data);

      toast.success('Transaction has been created. Please wait for few minutes.');

      await checkPair(token0, token1);
      refForm.current?.reset();
      dispatch(requestReload());
      dispatch(requestReloadRealtime());
    } catch (err) {
      console.log('err', err);

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
            fromAddress={fromAddress}
            toAddress={toAddress}
          />
        )}
      </Form>
    </Box>
  );
};

export default CreateMarket;
