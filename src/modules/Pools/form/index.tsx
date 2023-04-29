import {Box, Flex, forwardRef, Text, useToast} from "@chakra-ui/react";
import React, {useCallback, useEffect, useImperativeHandle, useRef, useState,} from "react";
import {Field, Form, useForm, useFormState} from "react-final-form";
import styles from "./styles.module.scss";
import {useAppDispatch} from "@/state/hooks";
import {requestReload, requestReloadRealtime} from "@/state/pnftExchange";
import {IToken} from "@/interfaces/token";
import useIsApproveERC20Token from "@/hooks/contract-operations/token/useIsApproveERC20Token";
import useBalanceERC20Token from "@/hooks/contract-operations/token/useBalanceERC20Token";
import useApproveERC20Token from "@/hooks/contract-operations/token/useApproveERC20Token";
import {getSwapTokens} from "@/services/token-explorer";
import {isDevelop} from "@/utils/commons";
import {camelCaseKeys, formatCurrency} from "@/utils";
import pairsMock from "@/dataMock/tokens.json";
import {UNIV2_ROUTER_ADDRESS} from "@/configs";
import InputWrapper from "@/components/Swap/form/inputWrapper";
import cx from "classnames";
import FieldAmount from "@/components/Swap/form/fieldAmount";
import {composeValidators, required} from "@/utils/formValidate";
import FilterButton from "@/components/Swap/filterToken";
import {BsPlus} from "react-icons/bs";
import WrapperConnected from "@/components/WrapperConnected";
import FiledButton from "@/components/Swap/button/filedButton";
import {isEmpty} from "lodash";
import toast from "react-hot-toast";
import {showError} from "@/utils/toast";
import useAddLiquidity from "@/hooks/contract-operations/pools/useAddLiquidity";

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
  const [baseBalance, setBaseBalance] = useState("0");
  const [quoteBalance, setQuoteBalance] = useState("0");

  console.log('isApproveBaseToken', isApproveBaseToken);
  console.log('isApproveQuoteToken', isApproveQuoteToken);
  console.log('baseBalance', baseBalance);
  console.log('quoteBalance', quoteBalance);
  console.log('=======');

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

  const fetchTokens = async (page = 1, isFetchMore = false) => {
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

      if(!isEmpty(baseToken) && !isApproveBaseToken) {
        await requestApproveToken(baseToken);
        setIsApproveBaseToken(true);
      } else if(!isEmpty(quoteToken) && !isApproveQuoteToken) {
        await requestApproveToken(quoteToken);
        setIsApproveQuoteToken(true);
      }

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
          className="btn-transfer"
          p={2}
          bgColor={'#B1B5C3'}
          borderRadius={'8px'}
        >
          <BsPlus color="black" />
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
          >
            Approve use of{' '}
            {!isApproveBaseToken ? baseToken?.symbol : quoteToken?.symbol}
          </FiledButton>
        )}
      </WrapperConnected>
    </form>
  );
});

// @ts-ignore
const CreateMarket = ({ }) => {
  const refForm = useRef();
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useAppDispatch();
  const { call: addLiquidity } = useAddLiquidity();

  const handleSubmit = async (values) => {
    console.log('handleSubmit', values);
    const { baseToken, quoteToken, baseAmount, quoteAmount } = values;
    try {
      setSubmitting(true);

      let { token0, token1 } = (baseToken.address.toLowerCase() < quoteToken.address.toLowerCase()) ? { token0: baseToken, token1: quoteToken } : { token0: quoteToken, token1: baseToken }
      let { amount0, amount1 } = (baseToken.address.toLowerCase() < quoteToken.address.toLowerCase()) ? { amount0: baseAmount, amount1: quoteAmount } : { amount0: quoteAmount, amount1: baseAmount }

      const data = {
        tokenA: token0?.address,
        tokenB: token1?.address,
        amountAMin: "0",
        amountADesired: amount0,
        amountBDesired: amount1,
        amountBMin: "0",
      };

      console.log('data', data);

      const response = await addLiquidity(data);

      console.log('response', response);

      toast.success('Transaction has been created. Please wait for few minutes.');
      refForm.current?.reset();
      dispatch(requestReload());
      dispatch(requestReloadRealtime());
    } catch (err) {
      showError({
        message:
          (err as Error).message ||
          'Something went wrong. Please try again later.',
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
