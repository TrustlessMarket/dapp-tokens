import {Box, Divider, Flex, forwardRef, Text, useToast,} from "@chakra-ui/react";
import {useRouter} from "next/router";
import React, {useCallback, useEffect, useRef, useState,} from "react";
import {Field, Form, useForm, useFormState} from "react-final-form";
import styles from "./styles.module.scss";
import HorizontalItem from "@/components/Swap/horizontalItem";
import SlippageSettingButton from "@/components/Swap/slippageSetting/button";
import cx from "classnames";
import FieldAmount from "@/components/Swap/form/fieldAmount";
import InputWrapper from "@/components/Swap/form/inputWrapper";
import {BsArrowDownShort} from "react-icons/bs";
import {composeValidators, required} from "@/utils/formValidate";
import BigNumber from "bignumber.js";
import {getTokens} from "@/services/token-explorer";
import {IToken} from "@/interfaces/token";
import FilterButton from "@/components/Swap/filterToken";
import {formatCurrency} from "@/utils";
import WrapButtonConnectWallet from "@/components/Swap/wrapButtonConnectWallet";
import FiledButton from "@/components/Swap/button/filedButton";

const LIMIT_PAGE = 50;

export const MakeFormSwap = forwardRef((props, ref) => {
  const {
    onSubmit,
    submitting,
  } = props;
  const [loading, setLoading] = useState(false);
  const [baseToken, setBaseToken] = useState(null);
  const [quoteToken, setQuoteToken] = useState(null);
  const [isApproveBaseToken, setIsApproveBaseToken] = useState(true);
  const [isApproveQuoteToken, setIsApproveQuoteToken] = useState(true);
  const [tokensList, setTokensList] = useState<IToken[]>([]);

  const { values, errors, touched } = useFormState();
  const { change, restart, focus } = useForm();
  const btnDisabled = loading;

  useEffect(() => {
    fetchTokens();
  }, []);

  const fetchTokens = async (page = 1, isFetchMore = false) => {
    try {
      setLoading(true);
      const res = await getTokens({ limit: LIMIT_PAGE, page: page });
      setTokensList(res);
    } catch (err: unknown) {
      console.log('Failed to fetch tokens owned');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectBaseToken = (token) => {
    setBaseToken(token);
  };

  const handleSelectQuoteToken = (token) => {
    setQuoteToken(token);
  };

  const onChangeTransferType = () => {
    if (loading) {
      return;
    }
    change("baseAmount", values?.quoteAmount);
    change("quoteAmount", values?.baseAmount);

    const temp = baseToken;
    setBaseToken(quoteToken);
    setQuoteToken(temp);
  };

  const validateBaseAmount = useCallback(
    (amount, values) => {

      return undefined;
    },
    [values.baseAmount]
  );

  const validateQuoteAmount = useCallback(
    (amount, values) => {

      return undefined;
    },
    [values.quoteAmount]
  );

  const onChangeValueQuoteAmount = (amount) => {
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

  const onApprove = async () => {
    const currentToken = !isApproveBaseToken ? baseToken : quoteToken;
    // try {
    //   setLoading(true);
    //   const response = await ERC20Approve(currentToken?.contract_address);
    //   setIsApproveBaseToken(true);
    //   toast({
    //     status: "success",
    //     title: (
    //       <>
    //         Approved successfully.{" "}
    //         <a
    //           target="_blank"
    //           href={getLinkEvmExplorer(response.tx_hash, "tx")}
    //           style={{ textDecoration: "underline" }}
    //         >
    //           View Transaction
    //         </a>
    //       </>
    //     ),
    //   });
    // } catch (e) {
    //   toastError(toast, e, {});
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <form onSubmit={onSubmit} style={{ height: "100%" }}>
      <HorizontalItem
        label={
          <Text fontSize={"md"} color={"#B1B5C3"}>
            Swap
          </Text>
        }
        value={
          <SlippageSettingButton></SlippageSettingButton>
        }
      />
      <InputWrapper
        className={cx(styles.inputAmountWrap, styles.inputBaseAmountWrap)}
        theme="light"
      >
        <Flex gap={4} direction={"column"}>
          <Field
            name="baseAmount"
            children={FieldAmount}
            validate={composeValidators(required, validateBaseAmount)}
            // fieldChanged={onChangeValueBaseAmount}
            disabled={submitting}
            // placeholder={"Enter number of tokens"}
            decimals={18}
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
            borderColor={"#F4F5F6"}
          />
        </Flex>
      </InputWrapper>
      <Flex justifyContent={"center"}>
        <Box
          onClick={onChangeTransferType}
          className="btn-transfer"
          cursor={"pointer"}
          p={2}
          bgColor={"#B1B5C3"}
          borderRadius={"8px"}
        >
          <BsArrowDownShort color="blue" />
        </Box>
      </Flex>

      <InputWrapper
        className={cx(styles.inputAmountWrap, styles.inputQuoteAmountWrap)}
        theme="light"
      >
        <Flex gap={4} direction={"column"}>
          <Field
            name="quoteAmount"
            // placeholder={`0 ${revertCoin[1].symbol}`}
            children={FieldAmount}
            validate={composeValidators(required, validateQuoteAmount)}
            fieldChanged={onChangeValueQuoteAmount}
            disabled={submitting}
            // placeholder={"Enter number of tokens"}
            decimals={18}
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
            borderColor={"#F4F5F6"}
          />
        </Flex>
      </InputWrapper>
      {
        baseToken && quoteToken && (
          <HorizontalItem
            label={
              <Text fontSize={"xs"} fontWeight={"medium"} color={"#23262F"}>
                1 {quoteToken?.base_token?.symbol} =&nbsp;
                {
                  formatCurrency(new BigNumber(quoteToken?.index_price).dividedBy(baseToken?.index_price).toNumber())
                }
                &nbsp;{baseToken?.base_token?.symbol}
              </Text>
            }
          />
        )
      }
      <WrapButtonConnectWallet
        buttonConfig={{ btnSize: "l", mt: 6 }}
        showBtnConnect={true}
        showSwitchButton={true}
        labelSwitchChain="Switch for approve"
      >
        {isApproveBaseToken && isApproveQuoteToken ? (
          <FiledButton
            isDisabled={submitting || btnDisabled}
            isLoading={submitting}
            type="submit"
            borderRadius={"100px !important"}
            // className="btn-submit"
            btnSize={"m"}
            containerConfig={{ flex: 1, mt: 6 }}
            loadingText={submitting ? "Processing" : " "}
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
            Approve use of {!isApproveBaseToken ? baseToken?.symbol : quoteToken?.symbol}
          </FiledButton>
        )}
      </WrapButtonConnectWallet>
    </form>
  );
});

// @ts-ignore
const TradingForm = ({ initValues }) => {
  const refForm = useRef();
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();
  const router = useRouter();

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
      <Form
        onSubmit={handleSubmit}
        initialValues={{  }}
      >
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
