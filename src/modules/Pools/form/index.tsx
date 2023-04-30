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
import pairsMock from '@/dataMock/tokens.json';
import useAddLiquidity from '@/hooks/contract-operations/pools/useAddLiquidity';
import useGetPair from '@/hooks/contract-operations/swap/useGetPair';
import useApproveERC20Token from '@/hooks/contract-operations/token/useApproveERC20Token';
import useBalanceERC20Token from '@/hooks/contract-operations/token/useBalanceERC20Token';
import useIsApproveERC20Token from '@/hooks/contract-operations/token/useIsApproveERC20Token';
import { IToken } from '@/interfaces/token';
import { getSwapTokens } from '@/services/token-explorer';
import { useAppDispatch } from '@/state/hooks';
import { requestReload, requestReloadRealtime } from '@/state/pnftExchange';
import {
  camelCaseKeys,
  compareString,
  formatCurrency,
  sortAddressPair,
} from '@/utils';
import { isDevelop } from '@/utils/commons';
import { composeValidators, required } from '@/utils/formValidate';
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
import cx from 'classnames';
import { isEmpty } from 'lodash';
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
import styles from './styles.module.scss';
import useGetReserves from '@/hooks/contract-operations/swap/useReserves';
import { formatEthPrice } from '@/utils/format';
import BigNumber from 'bignumber.js';
import useSupplyERC20Liquid from '@/hooks/contract-operations/token/useSupplyERC20Liquid';

const LIMIT_PAGE = 50;

export const MakeFormSwap = forwardRef((props, ref) => {
  const { onSubmit, submitting } = props;
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

  const isPaired = !compareString(pairAddress, NULL_ADDRESS);

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

      console.log(response);

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

  const fetchTokens = async (page = 1, _isFetchMore = false) => {
    try {
      setLoading(true);
      const res = await getSwapTokens({
        limit: LIMIT_PAGE,
        page: page,
        is_test: isDevelop() ? '1' : '',
      });
      setTokensList(camelCaseKeys(pairsMock));
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
      await approveToken({
        erc20TokenAddress: token.address,
        address: UNIV2_ROUTER_ADDRESS,
      });
    } catch (error) {
      throw error;
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
      setBaseBalance(_tokenBalance);
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
      setQuoteBalance(_tokenBalance);
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
  };

  const handleChangeMaxQuoteAmount = () => {
    change('quoteAmount', quoteBalance);
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
                : formatEthPrice(
                    new BigNumber(perPrice._reserve1)
                      .dividedBy(perPrice._reserve0)
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
            <Flex gap={1}>
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
                data={tokensList}
                commonData={tokensList.slice(0, 3)}
                handleSelectItem={handleSelectBaseToken}
                parentClose={close}
                value={baseToken}
              />
            }
            borderColor={'#F4F5F6'}
          />
        </Flex>
      </InputWrapper>
      <Flex justifyContent={'center'}>
        <Box className="btn-transfer" p={2} bgColor={'#B1B5C3'} borderRadius={'8px'}>
          <BsPlus color="black" />
        </Box>
      </Flex>

      <InputWrapper
        className={cx(styles.inputAmountWrap, styles.inputQuoteAmountWrap)}
        theme="light"
        label={' '}
        rightLabel={
          !isEmpty(quoteToken) && (
            <Flex gap={1}>
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
                data={tokensList}
                commonData={tokensList.slice(0, 3)}
                handleSelectItem={handleSelectQuoteToken}
                parentClose={close}
                value={quoteToken}
              />
            }
            // hideError={true}
            borderColor={'#F4F5F6'}
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
            btnSize={'m'}
            containerConfig={{ flex: 1 }}
            loadingText={submitting ? 'Processing' : ' '}
            // processInfo={{
            //   id: keyTransactionModule.proForm,
            //   size: "sm",
            // }}
          >
            Create
          </FiledButton>
        ) : (
          <FiledButton
            isLoading={loading}
            isDisabled={loading}
            loadingText="Processing"
            onClick={onApprove}
            type="button"
          >
            Approve use of{' '}
            {!isApproveBaseToken ? baseToken?.symbol : quoteToken?.symbol}
          </FiledButton>
        )}
      </WrapperConnected>
    </form>
  );
});

const CreateMarket = ({}) => {
  const refForm = useRef<any>();
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useAppDispatch();
  const { call: addLiquidity } = useAddLiquidity();

  const handleSubmit = async (values: any) => {
    console.log('handleSubmit', values);
    const { baseToken, quoteToken, baseAmount, quoteAmount } = values;
    try {
      setSubmitting(true);
      console.log(baseToken, quoteToken);

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

      console.log('data', data);

      const response = await addLiquidity(data);

      console.log('response', response);

      toast.success('Transaction has been created. Please wait for few minutes.');
      refForm.current?.reset();
      dispatch(requestReload());
      dispatch(requestReloadRealtime());
    } catch (err) {
      console.log(err);

      showError({
        message:
          (err as Error).message || 'Something went wrong. Please try again later.',
      });
    } finally {
      setSubmitting(false);
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

export default CreateMarket;
