/* eslint-disable react/no-children-prop */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import FiledButton from '@/components/Swap/button/filedButton';
import InputWrapper from '@/components/Swap/form/inputWrapper';
import WrapperConnected from '@/components/WrapperConnected';
import { toastError } from '@/constants/error';
import { IToken } from '@/interfaces/token';
import { logErrorToServer } from '@/services/swap';
import { useAppDispatch, useAppSelector } from '@/state/hooks';
import {
  requestReload,
  requestReloadRealtime,
  selectPnftExchange,
} from '@/state/pnftExchange';
import { getIsAuthenticatedSelector } from '@/state/user/selector';
import px2rem from '@/utils/px2rem';
import { showError } from '@/utils/toast';
import {
  Box,
  Center,
  Flex,
  forwardRef,
  Grid,
  GridItem, SimpleGrid,
  Text,
} from '@chakra-ui/react';
import { useWeb3React } from '@web3-react/core';
import cx from 'classnames';
import { useRouter } from 'next/router';
import { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Field, Form, useForm, useFormState } from 'react-final-form';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import styles from './styles.module.scss';
import {
  getTokenDetail,
  IUpdateTokenPayload,
  updateTokenInfo,
} from '@/services/token-explorer';
import FieldText from '@/components/Swap/form/fieldText';
import FileDropzoneUpload from '@/components/Swap/form/fileDropzoneUpload';
import { uploadFile } from '@/services/file';
import { compareString, formatCurrency, shortenAddress } from '@/utils';
import BigNumber from 'bignumber.js';
import { decimalToExponential } from '@/utils/format';
import { ROUTE_PATH } from '@/constants/route-path';

export const MAX_FILE_SIZE = 1024 * 1024; // 375 MB

const Avatar = ({ img, alt }: { img: string | any; alt: string | undefined }) => {
  return (
    <Center w={50} h={50} bg={'#FFFFFF10'} borderRadius={'50%'}>
      <img width={30} height={30} src={img} alt={alt} />
    </Center>
  );
};

const HorizontalItem = ({
  label,
  value,
}: {
  label: string | any;
  value: string | any;
}) => {
  return (
    <Flex gap={2} alignItems={'center'} justifyContent={'space-between'}>
      {label}
      {value}
    </Flex>
  );
};

export const MakeFormSwap = forwardRef((props, ref) => {
  const { onSubmit, submitting } = props;
  const [loading, setLoading] = useState(false);
  const [tokenInfo, setTokenInfo] = useState<IToken>();
  const isAuthenticated = useSelector(getIsAuthenticatedSelector);
  const router = useRouter();
  const [file, setFile] = useState<any>();
  const [uploading, setUploading] = useState(false);

  const { account } = useWeb3React();
  const needReload = useAppSelector(selectPnftExchange).needReload;

  const { values } = useFormState();
  const { change, restart } = useForm();
  const btnDisabled = loading || !compareString(tokenInfo?.owner, account);

  // console.log('values', values);
  // console.log('file', file);
  // console.log('account', account);
  // console.log('isAuthenticated', isAuthenticated);
  // console.log('router', router);
  // console.log('tokenInfo', tokenInfo);
  // console.log('=====');

  useImperativeHandle(ref, () => {
    return {
      reset: reset,
    };
  });

  const reset = async () => {
    restart({});
    setFile(null);
  };

  useEffect(() => {
    if (router?.query?.address) {
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
    if (tokenInfo) {
      change('description', tokenInfo?.description);
      change('website', tokenInfo?.social?.website);
      change('discord', tokenInfo?.social?.discord);
      change('instagram', tokenInfo?.social?.instagram);
      change('medium', tokenInfo?.social?.medium);
      change('telegram', tokenInfo?.social?.telegram);
      change('telegram', tokenInfo?.social?.telegram);
      change('twitter', tokenInfo?.social?.twitter);
      change('thumbnail', tokenInfo?.thumbnail);
    }
  }, [JSON.stringify(tokenInfo)]);

  const onFileChange = async (file: File) => {
    console.log('onFileChange', file);

    setFile(file);

    if (!file) {
      change('thumbnail', file);
    }

    try {
      setUploading(true);
      if (file) {
        const res = await uploadFile({ file: file });
        change('thumbnail', res?.url);
      }
    } catch (err) {
      const message =
        (err as Error).message || 'Something went wrong. Please try again later.';
      logErrorToServer({
        type: 'error',
        address: account,
        error: JSON.stringify(err),
        message: message,
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} style={{ height: '100%' }}>
      <SimpleGrid columns={2} gap={4}>
        <InputWrapper
          className={cx(styles.inputAmountWrap)}
          theme="light"
          label={
            <Text color={'#1C1C1C'}>
              TOKEN
            </Text>
          }
        >
          <Field
            name="tokenName"
            children={FieldText}
            disabled={submitting}
            placeholder={'Enter token name'}
            className={cx(styles.inputAmount, styles.collateralAmount)}
            borderColor={'#ECECED'}
          />
        </InputWrapper>
        <InputWrapper
          className={cx(styles.inputAmountWrap)}
          theme="light"
          label={
            <Text color={'#1C1C1C'}>
              DISCORD
            </Text>
          }
        >
          <Field
            name="tokenSymbol"
            children={FieldText}
            disabled={submitting}
            placeholder={'Enter symbol'}
            className={cx(styles.inputAmount, styles.collateralAmount)}
            borderColor={'#ECECED'}
          />
        </InputWrapper>
      </SimpleGrid>
      <InputWrapper
        className={cx(styles.inputAmountWrap)}
        theme="light"
        label={
          <Text color={'#1C1C1C'}>
            SUPPLY
          </Text>
        }
      >
        <Field
          name="tokenSymbol"
          children={FieldText}
          disabled={submitting}
          placeholder={'Enter max supply'}
          className={cx(styles.inputAmount, styles.collateralAmount)}
          borderColor={'#ECECED'}
        />
      </InputWrapper>
      <InputWrapper
        className={cx(styles.inputAmountWrap, styles.inputBaseAmountWrap)}
        theme="light"
        label={
          <Text color={'#1C1C1C'}>
            DESCRIPTION
          </Text>
        }
      >
        <Flex gap={4} direction={'column'}>
          <Field
            name="description"
            children={FieldText}
            // validate={composeValidators(required, validateQuoteAmount)}
            // fieldChanged={onChangeValueQuoteAmount}
            disabled={submitting}
            placeholder={'Enter description'}
            className={cx(styles.inputDescription)}
            // hideError={true}
            inputType={'textarea'}
            borderColor={'#ECECED'}
            rows="4"
          />
        </Flex>
      </InputWrapper>
      <InputWrapper
        className={cx(styles.submitVideo)}
        theme="light"
      >
        <FileDropzoneUpload
          className={styles.uploader}
          accept="image/*,audio/*,video/*"
          maxSize={MAX_FILE_SIZE}
          onChange={onFileChange}
          url={values?.thumbnail || tokenInfo?.thumbnail}
          loading={uploading}
        />
      </InputWrapper>
      <Text fontSize={px2rem(18)} fontWeight={500} color={'#1C1C1C'} opacity={"0.7"}>
        Social media
      </Text>
      <SimpleGrid columns={2} gap={4} mt={4}>
        <InputWrapper
          className={cx(styles.inputAmountWrap)}
          theme="light"
          label={
            <Text color={'#1C1C1C'}>
              WEBSITE
            </Text>
          }
        >
          <Field
            name="website"
            children={FieldText}
            disabled={submitting}
            placeholder={'Enter Website'}
            className={cx(styles.inputAmount, styles.collateralAmount)}
            borderColor={'#ECECED'}
          />
        </InputWrapper>
        <InputWrapper
          className={cx(styles.inputAmountWrap)}
          theme="light"
          label={
            <Text color={'#1C1C1C'}>
              DISCORD
            </Text>
          }
        >
          <Field
            name="discord"
            children={FieldText}
            disabled={submitting}
            placeholder={'Enter Discord'}
            className={cx(styles.inputAmount, styles.collateralAmount)}
            borderColor={'#ECECED'}
          />
        </InputWrapper>
        <InputWrapper
          className={cx(styles.inputAmountWrap)}
          theme="light"
          label={
            <Text color={'#1C1C1C'}>
              TWITTER
            </Text>
          }
        >
          <Field
            name="twitter"
            children={FieldText}
            disabled={submitting}
            placeholder={'Enter Twitter'}
            className={cx(styles.inputAmount, styles.collateralAmount)}
            borderColor={'#ECECED'}
          />
        </InputWrapper>
        <InputWrapper
          className={cx(styles.inputAmountWrap)}
          theme="light"
          label={
            <Text color={'#1C1C1C'}>
              TELEGRAM
            </Text>
          }
        >
          <Field
            name="telegram"
            children={FieldText}
            disabled={submitting}
            placeholder={'Enter Telegram'}
            className={cx(styles.inputAmount, styles.collateralAmount)}
            borderColor={'#ECECED'}
          />
        </InputWrapper>
      </SimpleGrid>
      <WrapperConnected type={'submit'} className={styles.submitButton}>
        <FiledButton
          isDisabled={submitting || btnDisabled}
          isLoading={submitting}
          type="submit"
          // borderRadius={'100px !important'}
          // className="btn-submit"
          btnSize={'h'}
          containerConfig={{ flex: 1, mt: 4 }}
          loadingText={submitting ? 'Processing' : ' '}
        >
          UPDATE
        </FiledButton>
      </WrapperConnected>
    </form>
  );
});

const CreateTokenForm = () => {
  const refForm = useRef<any>();
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useAppDispatch();
  const { account } = useWeb3React();
  const router = useRouter();

  const handleSubmit = async (values: any) => {
    const { tokenInfo } = values;
    console.log('handleSubmit', values);
    try {
      setSubmitting(true);

      const data: IUpdateTokenPayload = {
        name: tokenInfo?.name,
        symbol: tokenInfo?.symbol,
        thumbnail: values?.thumbnail || tokenInfo.thumbnail,
        description: values?.description,
        social: {
          discord: values?.discord,
          instagram: values?.instagram,
          medium: values?.medium,
          telegram: values?.telegram,
          twitter: values?.twitter,
          website: values?.website,
        },
      };

      const response = await updateTokenInfo(tokenInfo?.address, data);

      router.push(`${ROUTE_PATH.TOKEN}?address=${tokenInfo?.address}`);
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

export default CreateTokenForm;
