/* eslint-disable react/no-children-prop */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import FiledButton from '@/components/Swap/button/filedButton';
import FieldAmount from '@/components/Swap/form/fieldAmount';
import InputWrapper from '@/components/Swap/form/inputWrapper';
import WrapperConnected from '@/components/WrapperConnected';
import {toastError} from '@/constants/error';
import {IToken} from '@/interfaces/token';
import {logErrorToServer} from '@/services/swap';
import {useAppDispatch, useAppSelector} from '@/state/hooks';
import {requestReload, requestReloadRealtime, selectPnftExchange,} from '@/state/pnftExchange';
import {getIsAuthenticatedSelector} from '@/state/user/selector';
import px2rem from '@/utils/px2rem';
import {showError} from '@/utils/toast';
import {Box, Flex, forwardRef, Text} from '@chakra-ui/react';
import {useWeb3React} from '@web3-react/core';
import cx from 'classnames';
import {useRouter} from 'next/router';
import {useEffect, useImperativeHandle, useRef, useState,} from 'react';
import {Field, Form, useForm, useFormState} from 'react-final-form';
import toast from 'react-hot-toast';
import {useSelector} from 'react-redux';
import styles from './styles.module.scss';
import {getTokenDetail, IUpdateTokenPayload, updateTokenInfo} from "@/services/token-explorer";
import FieldText from "@/components/Swap/form/fieldText";
import FileDropzoneUpload from "@/components/Swap/form/fileDropzoneUpload";
import {uploadFile} from "@/services/file";
import {compareString} from "@/utils";

const LIMIT_PAGE = 50;
const FEE = 3;
export const DEFAULT_BASE_TOKEN = '0xfB83c18569fB43f1ABCbae09Baf7090bFFc8CBBD';
export const DEFAULT_QUOTE_TOKEN = '0xdd2863416081D0C10E57AaB4B3C5197183be4B34';
const MAX_FILE_SIZE = 393216000; // 375 MB

export const MakeFormSwap = forwardRef((props, ref) => {
  const { onSubmit, submitting } = props;
  const [loading, setLoading] = useState(false);
  const [tokenInfo, setTokenInfo] = useState<IToken>();
  const isAuthenticated = useSelector(getIsAuthenticatedSelector);
  const router = useRouter();
  const [file, setFile] = useState<any>();

  const { account } = useWeb3React();
  const needReload = useAppSelector(selectPnftExchange).needReload;

  const { values } = useFormState();
  const { change, restart } = useForm();
  const btnDisabled = loading || !compareString(tokenInfo?.owner, account);

  console.log('values', values);
  console.log('file', file);
  console.log('account', account);
  console.log('isAuthenticated', isAuthenticated);
  console.log('router', router);
  console.log('tokenInfo', tokenInfo);
  console.log('=====');

  useImperativeHandle(ref, () => {
    return {
      reset: reset,
    };
  });

  const reset = async () => {
    restart({
    });
  };

  useEffect(() => {
    if(router?.query?.address) {
      fetchTokenDetail(router?.query?.address);
    }
  }, [needReload, router?.query?.address]);

  const fetchTokenDetail = async (address: any) => {
    try {
      setLoading(true);
      const res = await getTokenDetail(address);
      setTokenInfo(res);
      change('tokenInfo', res);
    } catch (err: unknown) {
      console.log('Failed to fetch tokens owned');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(tokenInfo) {
      change('totalSupply', tokenInfo?.totalSupply);
      change('name', tokenInfo?.name);
      change('symbol', tokenInfo?.symbol);
      change('owner', tokenInfo?.owner);
    }
  }, [JSON.stringify(tokenInfo)]);

  const onFileChange = async (file: File) => {
    setFile(file);

    if(file) {
      const res = await uploadFile({file: file});
      console.log('onFileChange', res);
      change('thumbnail', res?.url);
    }
  };

  return (
    <form onSubmit={onSubmit} style={{ height: '100%' }}>
      <Flex>
        <Box flex={1}>
          <div className={styles.submitVideo}>
            <FileDropzoneUpload className={styles.uploader} accept="image/*,audio/*,video/*" maxSize={MAX_FILE_SIZE} onChange={onFileChange} />
          </div>
        </Box>
        <Box flex={2}>
          <InputWrapper
            className={cx(styles.inputAmountWrap, styles.inputBaseAmountWrap)}
            theme="light"
            label={<Text fontSize={px2rem(16)}>Name</Text>}
          >
            <Field
              name="name"
              children={FieldText}
              disabled={true}
              className={styles.inputAmount}
              borderColor={'#5B5B5B'}
            />
          </InputWrapper>
          <InputWrapper
            className={cx(styles.inputAmountWrap, styles.inputBaseAmountWrap)}
            theme="light"
            label={<Text fontSize={px2rem(16)}>Symbol</Text>}
          >
            <Field
              name="symbol"
              children={FieldText}
              disabled={true}
              className={styles.inputAmount}
              borderColor={'#5B5B5B'}
            />
          </InputWrapper>
          <InputWrapper
            className={cx(styles.inputAmountWrap, styles.inputBaseAmountWrap)}
            theme="light"
            label={<Text fontSize={px2rem(16)}>Total supply</Text>}
          >
            <Field
              name="totalSupply"
              children={FieldAmount}
              disabled={true}
              decimals={tokenInfo?.decimal || 18}
              className={styles.inputAmount}
              borderColor={'#5B5B5B'}
            />
          </InputWrapper>
          <InputWrapper
            className={cx(styles.inputAmountWrap, styles.inputBaseAmountWrap)}
            theme="light"
            label={<Text fontSize={px2rem(16)}>Owner</Text>}
          >
            <Field
              name="owner"
              children={FieldText}
              disabled={true}
              className={styles.inputAmount}
              borderColor={'#5B5B5B'}
            />
          </InputWrapper>
        </Box>
      </Flex>
      <InputWrapper
        className={cx(styles.inputAmountWrap, styles.inputQuoteAmountWrap)}
        theme="light"
        label={<Text fontSize={px2rem(16)}>Description</Text>}
      >
        <Flex gap={4} direction={'column'}>
          <Field
            name="description"
            children={FieldText}
            // validate={composeValidators(required, validateQuoteAmount)}
            // fieldChanged={onChangeValueQuoteAmount}
            disabled={submitting}
            placeholder={"Enter description"}
            className={cx(styles.inputAmount, styles.collateralAmount)}
            // hideError={true}
            inputType={'textarea'}
            borderColor={'#5B5B5B'}
          />
        </Flex>
      </InputWrapper>
      <WrapperConnected
        type={'submit'}
        className={styles.submitButton}
      >
        <FiledButton
          isDisabled={submitting || btnDisabled}
          isLoading={submitting}
          type="submit"
          // borderRadius={'100px !important'}
          // className="btn-submit"
          btnSize={'h'}
          containerConfig={{ flex: 1 }}
          loadingText={submitting ? 'Processing' : ' '}
        >
          UPDATE
        </FiledButton>
      </WrapperConnected>
    </form>
  );
});

const TradingForm = () => {
  const refForm = useRef<any>();
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useAppDispatch();
  const { account } = useWeb3React();

  const handleSubmit = async (values: any) => {
    const { thumbnail, tokenInfo } = values;
    console.log('handleSubmit', values);
    try {
      setSubmitting(true);

      const data: IUpdateTokenPayload = {
        thumbnail: thumbnail,
      };

      const response = await updateTokenInfo(tokenInfo?.address, data);

      console.log('response', response);

      toast.success('Update token info successfully!');
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
