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
import {IToken} from '@/interfaces/token';
import {getSwapTokens} from '@/services/token-explorer';
import {formatCurrency} from '@/utils';
import {composeValidators, required} from '@/utils/formValidate';
import {Box, Flex, forwardRef, Text} from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import cx from 'classnames';
import {SetStateAction, useCallback, useEffect, useRef, useState} from 'react';
import {Field, Form, useForm, useFormState} from 'react-final-form';
import {BsArrowDownShort} from 'react-icons/bs';
import styles from './styles.module.scss';
import {isDevelop} from "@/utils/commons";

const LIMIT_PAGE = 50;

export const MakeFormSwap = forwardRef((props) => {
  const { onSubmit, submitting } = props;
  const [loading, setLoading] = useState(false);
  const [baseToken, setBaseToken] = useState<any>({});
  const [quoteToken, setQuoteToken] = useState<any>({});
  const [isApproveBaseToken, setIsApproveBaseToken] = useState(true);
  const [isApproveQuoteToken, setIsApproveQuoteToken] = useState(true);
  const [tokensList, setTokensList] = useState<IToken[]>([]);

  const { values } = useFormState();
  const { change } = useForm();
  const btnDisabled = loading;

  useEffect(() => {
    fetchTokens();
  }, []);

  const fetchTokens = async (page = 1, isFetchMore = false) => {
    try {
      setLoading(true);
      const res = await getSwapTokens({ limit: LIMIT_PAGE, page: page, is_test: isDevelop() ? 1 : '' });
      setTokensList(res);
    } catch (err: unknown) {
      console.log('Failed to fetch tokens owned');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectBaseToken = (token: SetStateAction<null>) => {
    setBaseToken(token);
  };

  const handleSelectQuoteToken = (token: SetStateAction<null>) => {
    setQuoteToken(token);
  };

  const onChangeTransferType = () => {
    if (loading) {
      return;
    }
    change('baseAmount', values?.quoteAmount);
    change('quoteAmount', values?.baseAmount);

    const temp = baseToken;
    setBaseToken(quoteToken);
    setQuoteToken(temp);
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

  const onApprove = async () => {
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
          <BsArrowDownShort color="black"/>
        </Box>
      </Flex>

      <InputWrapper
        className={cx(styles.inputAmountWrap, styles.inputQuoteAmountWrap)}
        theme="light"
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
      {baseToken && quoteToken && (
        <HorizontalItem
          label={
            <Text fontSize={'xs'} fontWeight={'medium'} color={'#23262F'}>
              1 {quoteToken?.base_token?.symbol} =&nbsp;
              {formatCurrency(
                new BigNumber(quoteToken?.index_price)
                  .dividedBy(baseToken?.index_price)
                  .toNumber(),
              )}
              &nbsp;{baseToken?.base_token?.symbol}
            </Text>
          }
        />
      )}
      <WrapperConnected
      className={styles.submitButton}
      >
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
            Swap
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
