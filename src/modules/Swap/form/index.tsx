/* eslint-disable react/no-children-prop */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import FiledButton from '@/components/Swap/button/filedButton';
import FilterButton from '@/components/Swap/filterToken';
import FieldAmount from '@/components/Swap/form/fieldAmount';
import InputWrapper from '@/components/Swap/form/inputWrapper';
import HorizontalItem from '@/components/Swap/horizontalItem';
import SlippageSettingButton from '@/components/Swap/slippageSetting/button';
import WrapperConnected from '@/components/WrapperConnected';
import {UNIV2_ROUTER_ADDRESS} from '@/configs';
import useApproveERC20Token from '@/hooks/contract-operations/token/useApproveERC20Token';
import useBalanceERC20Token from '@/hooks/contract-operations/token/useBalanceERC20Token';
import useIsApproveERC20Token from '@/hooks/contract-operations/token/useIsApproveERC20Token';
import {IToken} from '@/interfaces/token';
import {getSwapTokens} from '@/services/token-explorer';
import {compareString, formatCurrency} from '@/utils';
import {isDevelop} from '@/utils/commons';
import {composeValidators, required} from '@/utils/formValidate';
import {Box, Flex, forwardRef, Text} from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import cx from 'classnames';
import React, {useCallback, useEffect, useImperativeHandle, useRef, useState} from 'react';
import {Field, Form, useForm, useFormState} from 'react-final-form';
import {BsArrowDownShort} from 'react-icons/bs';
import styles from './styles.module.scss';
import {isEmpty} from "lodash";
import toast from "react-hot-toast";
import {showError} from "@/utils/toast";
import useGetPair from "@/hooks/contract-operations/swap/useGetPair";
import useGetReserves from "@/hooks/contract-operations/swap/useReserves";
import {formatEthPrice} from "@/utils/format";

const LIMIT_PAGE = 50;

export const MakeFormSwap = forwardRef((props, ref) => {
  const { onSubmit, submitting } = props;
  const [loading, setLoading] = useState(false);
  const [baseToken, setBaseToken] = useState<any>({});
  const [quoteToken, setQuoteToken] = useState<any>({});
  const [isApproveBaseToken, setIsApproveBaseToken] = useState(true);
  const [isApproveQuoteToken, setIsApproveQuoteToken] = useState(true);
  const [tokensList, setTokensList] = useState<IToken[]>([]);
  const { call: isApproved } = useIsApproveERC20Token();
  const { call: tokenBalance } = useBalanceERC20Token();
  const { call: approveToken } = useApproveERC20Token();
  const { call: getPair } = useGetPair();
  const { call: getReserves } = useGetReserves();
  const [baseBalance, setBaseBalance] = useState("0");
  const [quoteBalance, setQuoteBalance] = useState("0");
  const [pairAddress, setPairAddress] = useState(null);
  const [baseReserve, setBaseReserve] = useState("0");
  const [quoteReserve, setQuoteReserve] = useState("0");

  const { values } = useFormState();
  const { change, restart } = useForm();
  const btnDisabled = loading;

  useImperativeHandle(ref, () => {
    return {
      reset: reset,
    };
  });

  const reset = async () => {
    restart({  });
  };

  useEffect(() => {
    fetchTokens();
  }, []);

  useEffect(() => {
    if(baseToken?.address && quoteToken?.address) {
      getPairAddress();
    }
  }, [baseToken?.address, quoteToken?.address]);

  useEffect(() => {
    if(pairAddress) {
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
      setTokensList(res);
    } catch (err: unknown) {
      console.log('Failed to fetch tokens owned');
    } finally {
      setLoading(false);
    }
  };

  const getReservesInfo = async () => {
    let { token0, token1 } = (baseToken.address.toLowerCase() < quoteToken.address.toLowerCase()) ? { token0: baseToken, token1: quoteToken } : { token0: quoteToken, token1: baseToken }
    try {
      const [reserve0, reserve1] = await getReserves({
        erc20TokenAddress: pairAddress
      });

      if(compareString(token0?.address, baseToken?.address)) {
        setBaseReserve(formatEthPrice(reserve0.toString()));
        setQuoteReserve(formatEthPrice(reserve1.toString()));
      } else {
        setQuoteReserve(formatEthPrice(reserve0.toString()));
        setBaseReserve(formatEthPrice(reserve1.toString()));
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const getPairAddress = async () => {
    let { token0, token1 } = (baseToken.address.toLowerCase() < quoteToken.address.toLowerCase()) ? { token0: baseToken, token1: quoteToken } : { token0: quoteToken, token1: baseToken }
    try {
      const response = await getPair({
        address0: token0?.address,
        address1: token1?.address
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
    }
  };

  const getTokenBalance = async (token: IToken) => {
    try {
      const response = await tokenBalance({
        erc20TokenAddress: token.address,
      });
      console.log('getTokenBalance', token, response);
      return response;
    } catch (error) {
      console.log('error', error);
    }
  };

  const requestApproveToken = async (token: IToken) => {
    try {
      const response = await approveToken({
        erc20TokenAddress: token.address,
        address: UNIV2_ROUTER_ADDRESS,
      });
    } catch (error) {
      console.log('error', error);
    }
  };

  const handleSelectBaseToken = async (token: IToken) => {
    setIsApproveBaseToken(await checkTokenApprove(token));
    setBaseBalance(await getTokenBalance(token));
    setBaseToken(token);
    change('baseToken', token);
  };

  const handleSelectQuoteToken = async (token: IToken) => {
    setIsApproveQuoteToken(await checkTokenApprove(token));
    setQuoteBalance(await getTokenBalance(token));
    setQuoteToken(token);
    change('quoteToken', token);
  };

  const onChangeTransferType = () => {
    if (loading) {
      return;
    }
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
  };

  const validateBaseAmount = useCallback(() => {
    return undefined;
  }, [values.baseAmount]);

  const validateQuoteAmount = useCallback(() => {
    return undefined;
  }, [values.quoteAmount]);

  const onChangeValueQuoteAmount = () => {
    // onQuoteAmountChange({
    //   amount,
    //   exchangeRate,
    //   buyingPower,
    //   maxLeverage: max_leverage,
    //   tradingPair,
    //   type: values.type,
    //   isConnected,
    // });
  };

  const handleChangeMaxBaseAmount = () => {
    change('baseAmount', baseBalance);
  }

  const handleChangeMaxQuoteAmount = () => {
    change('quoteAmount', quoteBalance);
  }

  const onApprove = async () => {
    try {
      setLoading(true);

      await requestApproveToken(baseToken);
      setIsApproveBaseToken(true);

      toast.success('Transaction has been created. Please wait for few minutes.');
    } catch (err) {
      showError({
        message:
          (err as Error).message ||
          'Something went wrong. Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} style={{ height: '100%' }}>
      <HorizontalItem
        label={
          <Text fontSize={'md'} color={'#B1B5C3'}>
            Swap
          </Text>
        }
        value={<SlippageSettingButton></SlippageSettingButton>}
      />
      <InputWrapper
        className={cx(styles.inputAmountWrap, styles.inputBaseAmountWrap)}
        theme="light"
        label={" "}
        rightLabel={
          !isEmpty(baseToken) && (
            <Flex gap={1}>
              <Text>
                Balance: {formatCurrency(baseBalance)} {baseToken?.symbol}
              </Text>
              <Text cursor={"pointer"} color={"#3385FF"} onClick={handleChangeMaxBaseAmount}>
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
            // fieldChanged={onChangeValueBaseAmount}
            disabled={submitting}
            // placeholder={"Enter number of tokens"}
            decimals={baseToken?.decimals || 18}
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
        <Box
          onClick={onChangeTransferType}
          className="btn-transfer"
          cursor={'pointer'}
          p={2}
          bgColor={'#B1B5C3'}
          borderRadius={'8px'}
        >
          <BsArrowDownShort color="black" />
        </Box>
      </Flex>

      <InputWrapper
        className={cx(styles.inputAmountWrap, styles.inputQuoteAmountWrap)}
        theme="light"
        label={" "}
        rightLabel={
          !isEmpty(quoteToken) && (
            <Flex gap={1}>
              <Text>
                Balance: {formatCurrency(quoteBalance)} {quoteToken?.symbol}
              </Text>
              <Text cursor={"pointer"} color={"#3385FF"} onClick={handleChangeMaxQuoteAmount}>
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
      {!isEmpty(baseToken) && !isEmpty(quoteToken) && (
        <HorizontalItem
          label={
            <Text fontSize={'xs'} fontWeight={'medium'} color={'#23262F'}>
              1 {quoteToken?.symbol} =&nbsp;
              {formatCurrency(
                new BigNumber(baseReserve)
                  .dividedBy(quoteReserve)
                  .toNumber(),
              )}
              &nbsp;{baseToken?.symbol}
            </Text>
          }
        />
      )}
      <WrapperConnected className={styles.submitButton}>
        {isApproveBaseToken ? (
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
            Swap
          </FiledButton>
        ) : (
          <FiledButton
            isLoading={loading}
            isDisabled={loading}
            loadingText="Processing"
            onClick={onApprove}
          >
            Approve use of{' '}{baseToken?.symbol}
          </FiledButton>
        )}
      </WrapperConnected>
    </form>
  );
});

const TradingForm = () => {
  const refForm = useRef();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values: any) => {
    try {
      setSubmitting(true);

      console.log('handleSubmit', values);
    } catch (e) {
      // toastError(toast, e, { slippage, maxSlippage: 2 });
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

export default TradingForm;
