/* eslint-disable react/no-children-prop */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import FiledButton from '@/components/Swap/button/filedButton';
import InputWrapper from '@/components/Swap/form/inputWrapper';
import WrapperConnected from '@/components/WrapperConnected';
import {toastError} from '@/constants/error';
import {IToken} from '@/interfaces/token';
import {logErrorToServer} from '@/services/swap';
import {useAppDispatch} from '@/state/hooks';
import {requestReload, requestReloadRealtime, updateCurrentTransaction,} from '@/state/pnftExchange';
import px2rem from '@/utils/px2rem';
import {showError} from '@/utils/toast';
import {Box, Flex, forwardRef, SimpleGrid, Text} from '@chakra-ui/react';
import {useWeb3React} from '@web3-react/core';
import cx from 'classnames';
import React, {useContext, useImperativeHandle, useRef, useState} from 'react';
import {Field, Form, useForm, useFormState} from 'react-final-form';
import toast from 'react-hot-toast';
import styles from './styles.module.scss';
import {createTokenInfo, IUpdateTokenPayload} from '@/services/token-explorer';
import FieldText from '@/components/Swap/form/fieldText';
import FileDropzoneUpload from '@/components/Swap/form/fileDropzoneUpload';
import {uploadFile} from '@/services/file';
import {composeValidators, required} from '@/utils/formValidate';
import FieldAmount from '@/components/Swap/form/fieldAmount';
import useContractOperation from '@/hooks/contract-operations/useContractOperation';
import useCreateToken, {ICreateTokenParams,} from '@/hooks/contract-operations/token/useCreateToken';
import {DeployContractResponse} from '@/interfaces/contract-operation';
import {TransactionStatus} from '@/components/Swap/alertInfoProcessing/interface';
import {transactionType} from '@/components/Swap/alertInfoProcessing/types';
import {BiUpload} from 'react-icons/bi';
import {WalletContext} from "@/contexts/wallet-context";
import {IResourceChain} from "@/interfaces/chain";

export const MAX_FILE_SIZE = 1024 * 1024; // 375 MB

export const MakeFormSwap = forwardRef((props, ref) => {
  const { onSubmit, submitting } = props;
  const [tokenInfo, setTokenInfo] = useState<IToken>();
  const [file, setFile] = useState<any>();
  const [uploading, setUploading] = useState(false);

  const { account } = useWeb3React();

  const { values } = useFormState();
  const { change, restart } = useForm();
  const btnDisabled = submitting;

  useImperativeHandle(ref, () => {
    return {
      reset: reset,
    };
  });

  const reset = async () => {
    restart({});
    setFile(null);
  };

  const onFileChange = async (file: File) => {
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
          label={<Text color={'#1C1C1C'}>TOKEN</Text>}
        >
          <Field
            name="tokenName"
            children={FieldText}
            validate={composeValidators(required)}
            disabled={submitting}
            placeholder={'Enter token name'}
            className={cx(styles.inputAmount)}
            borderColor={'#ECECED'}
          />
        </InputWrapper>
        <InputWrapper
          className={cx(styles.inputAmountWrap)}
          theme="light"
          label={<Text color={'#1C1C1C'}>SYMBOL</Text>}
        >
          <Field
            name="tokenSymbol"
            children={FieldText}
            validate={composeValidators(required)}
            disabled={submitting}
            placeholder={'Enter symbol'}
            className={cx(styles.inputAmount)}
            borderColor={'#ECECED'}
          />
        </InputWrapper>
      </SimpleGrid>
      <InputWrapper
        className={cx(styles.inputAmountWrap)}
        theme="light"
        label={<Text color={'#1C1C1C'}>SUPPLY</Text>}
      >
        <Field
          name="tokenMaxSupply"
          children={FieldAmount}
          validate={composeValidators(required)}
          disabled={submitting}
          placeholder={'Enter max supply'}
          className={cx(styles.inputAmount)}
          borderColor={'#ECECED'}
        />
      </InputWrapper>
      <InputWrapper
        className={cx(styles.inputAmountWrap, styles.inputBaseAmountWrap)}
        theme="light"
        label={<Text color={'#1C1C1C'}>DESCRIPTION</Text>}
      >
        <Flex gap={4} direction={'column'}>
          <Field
            name="description"
            children={FieldText}
            validate={composeValidators(required)}
            disabled={submitting}
            placeholder={'Enter description'}
            className={cx(styles.inputDescription)}
            // hideError={true}
            inputType={'textarea'}
            borderColor={'#ECECED'}
            rows="3"
          />
        </Flex>
      </InputWrapper>
      <InputWrapper className={cx(styles.submitVideo)} theme="light">
        <FileDropzoneUpload
          className={styles.uploader}
          accept="image/*,audio/*,video/*"
          maxSize={MAX_FILE_SIZE}
          onChange={onFileChange}
          url={values?.thumbnail || tokenInfo?.thumbnail}
          loading={uploading}
          text={
            <Text fontSize={''} color={'#000000'}>
              Upload token icon
            </Text>
          }
          icon={<BiUpload color={'#000000'} fontSize={'20px'} fontWeight={700} />}
        />
        {/*{touched?.quoteAmount && errors.quoteAmount && (
          <Text fontSize="xs" color="brand.danger.400" mt={2}>
            {errors.quoteAmount}
          </Text>
        )}*/}
      </InputWrapper>
      <Text fontSize={px2rem(18)} fontWeight={500} color={'#1C1C1C'} opacity={'0.7'}>
        Social media
      </Text>
      <SimpleGrid columns={2} gap={4} mt={4}>
        <InputWrapper
          className={cx(styles.inputAmountWrap)}
          theme="light"
          label={<Text color={'#1C1C1C'}>WEBSITE</Text>}
        >
          <Field
            name="website"
            children={FieldText}
            disabled={submitting}
            placeholder={'Enter Website'}
            className={cx(styles.inputAmount)}
            borderColor={'#ECECED'}
          />
        </InputWrapper>
        <InputWrapper
          className={cx(styles.inputAmountWrap)}
          theme="light"
          label={<Text color={'#1C1C1C'}>DISCORD</Text>}
        >
          <Field
            name="discord"
            children={FieldText}
            disabled={submitting}
            placeholder={'Enter Discord'}
            className={cx(styles.inputAmount)}
            borderColor={'#ECECED'}
          />
        </InputWrapper>
        <InputWrapper
          className={cx(styles.inputAmountWrap)}
          theme="light"
          label={<Text color={'#1C1C1C'}>TWITTER</Text>}
        >
          <Field
            name="twitter"
            children={FieldText}
            disabled={submitting}
            placeholder={'Enter Twitter'}
            className={cx(styles.inputAmount)}
            borderColor={'#ECECED'}
          />
        </InputWrapper>
        <InputWrapper
          className={cx(styles.inputAmountWrap)}
          theme="light"
          label={<Text color={'#1C1C1C'}>TELEGRAM</Text>}
        >
          <Field
            name="telegram"
            children={FieldText}
            disabled={submitting}
            placeholder={'Enter Telegram'}
            className={cx(styles.inputAmount)}
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
          processInfo={{
            id: transactionType.createToken,
            theme: 'light',
          }}
          btnSize={'h'}
          containerConfig={{ flex: 1, mt: 4 }}
          loadingText={submitting ? 'Processing' : ' '}
        >
          Create
        </FiledButton>
      </WrapperConnected>
    </form>
  );
});

const CreateTokenForm = (props: any) => {
  // const { onClose } = props;
  const refForm = useRef<any>();
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useAppDispatch();
  const { account } = useWeb3React();
  const { run: createToken } = useContractOperation<
    ICreateTokenParams,
    DeployContractResponse | null
  >({
    operation: useCreateToken,
  });
  const { getConnectedChainInfo } = useContext(WalletContext);
  const chainInfo: IResourceChain = getConnectedChainInfo();

  const handleSubmit = async (values: any) => {
    try {
      setSubmitting(true);
      dispatch(
        updateCurrentTransaction({
          status: TransactionStatus.info,
          id: transactionType.createToken,
        }),
      );
      const res = await createToken({
        name: values?.tokenName,
        symbol: values?.tokenSymbol,
        maxSupply: Number(values?.tokenMaxSupply),
      });

      if (!res) {
        throw Error('Cannot create new Smart BRC-20 Token');
      }

      const data: IUpdateTokenPayload = {
        name: values?.tokenName,
        symbol: values?.tokenSymbol,
        thumbnail: values?.thumbnail,
        description: values?.description,
        social: {
          discord: values?.discord,
          instagram: values?.instagram,
          medium: values?.medium,
          telegram: values?.telegram,
          twitter: values?.twitter,
          website: values?.website,
        },
        contract_address: res.contractAddress,
        tx_hash: res.hash,
        total_supply: values?.tokenMaxSupply,
      };

      const params = {
        network: chainInfo?.chain?.toLowerCase(),
        address: account,
      };

      const response = await createTokenInfo(params, data);

      // router.push(`${ROUTE_PATH.TOKEN}?address=${res.contractAddress}`);
      toast.success('Transaction has been created. Please wait for few minutes.', {
        duration: 5000,
      });
      // refForm.current?.reset();
      dispatch(requestReload());
      dispatch(requestReloadRealtime());
      dispatch(
        updateCurrentTransaction({
          status: TransactionStatus.success,
          id: transactionType.createToken,
          hash: res.hash,
          infoTexts: {
            success: 'Token has been created successfully.',
          },
        }),
      );
      // onClose && onClose();
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
      // setSubmitting(false);
      // dispatch(updateCurrentTransaction(null));
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
