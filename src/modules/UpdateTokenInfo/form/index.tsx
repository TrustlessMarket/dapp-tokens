/* eslint-disable react/no-children-prop */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import FiledButton from '@/components/Swap/button/filedButton';
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
import {Box, Center, Flex, forwardRef, Grid, GridItem, Text,} from '@chakra-ui/react';
import {useWeb3React} from '@web3-react/core';
import cx from 'classnames';
import {useRouter} from 'next/router';
import {useEffect, useImperativeHandle, useRef, useState} from 'react';
import {Field, Form, useForm, useFormState} from 'react-final-form';
import toast from 'react-hot-toast';
import {useSelector} from 'react-redux';
import styles from './styles.module.scss';
import {getTokenDetail, IUpdateTokenPayload, updateTokenInfo,} from '@/services/token-explorer';
import FieldText from '@/components/Swap/form/fieldText';
import FileDropzoneUpload from '@/components/Swap/form/fileDropzoneUpload';
import {uploadFile} from '@/services/file';
import {compareString, formatCurrency, shortenAddress} from '@/utils';
import {ROUTE_PATH} from '@/constants/route-path';
import {composeValidators, isTwitter} from '@/utils/formValidate';
import {IResourceChain} from "@/interfaces/chain";

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
  const currentChain: IResourceChain = useSelector(selectPnftExchange).currentChain;

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
  }, [needReload, router?.query?.address, currentChain?.chain]);

  const fetchTokenDetail = async (address: any) => {
    try {
      setLoading(true);
      const res = await getTokenDetail(address, {network: currentChain?.chain?.toLowerCase()});
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
      <Grid templateColumns={['1.25fr 1fr']} gap={[16]}>
        <GridItem>
          <InputWrapper
            className={cx(styles.submitVideo)}
            theme="light"
            label={
              <Text fontSize={px2rem(14)} color={'#FFFFFF'}>
                Token icon
              </Text>
            }
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
          <InputWrapper
            className={cx(styles.inputAmountWrap, styles.inputBaseAmountWrap)}
            theme="light"
            label={
              <Text fontSize={px2rem(14)} color={'#FFFFFF'}>
                Description
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
                borderColor={'#353945'}
                rows="4"
              />
            </Flex>
          </InputWrapper>
          <InputWrapper
            className={cx(styles.inputAmountWrap, styles.inputQuoteAmountWrap)}
            theme="light"
            label={
              <Text fontSize={px2rem(14)} color={'#FFFFFF'}>
                Reference
              </Text>
            }
          >
            <Flex gap={4} direction={'column'}>
              <Field
                name="website"
                children={FieldText}
                disabled={submitting}
                placeholder={'Enter Website'}
                className={cx(styles.inputAmount, styles.collateralAmount)}
                borderColor={'#353945'}
              />
              <Field
                name="discord"
                children={FieldText}
                disabled={submitting}
                placeholder={'Enter Discord'}
                className={cx(styles.inputAmount, styles.collateralAmount)}
                borderColor={'#353945'}
              />
              {/*<Field
                name="instagram"
                children={FieldText}
                disabled={submitting}
                placeholder={"Enter Instagram"}
                className={cx(styles.inputAmount, styles.collateralAmount)}
                borderColor={'#353945'}
              />*/}
              {/*<Field
                name="medium"
                children={FieldText}
                disabled={submitting}
                placeholder={"Enter Medium"}
                className={cx(styles.inputAmount, styles.collateralAmount)}
                borderColor={'#353945'}
              />*/}
              <Field
                name="telegram"
                children={FieldText}
                disabled={submitting}
                placeholder={'Enter Telegram'}
                className={cx(styles.inputAmount, styles.collateralAmount)}
                borderColor={'#353945'}
              />
              <Field
                name="twitter"
                children={FieldText}
                disabled={submitting}
                placeholder={'Enter Twitter'}
                className={cx(styles.inputAmount, styles.collateralAmount)}
                borderColor={'#353945'}
                validate={composeValidators(isTwitter)}
              />
            </Flex>
          </InputWrapper>
          <Box mt={6} />
          <WrapperConnected type={'submit'} className={styles.submitButton}>
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
        </GridItem>
        <GridItem>
          <Flex
            direction={'column'}
            className={styles.staticInfo}
            p={6}
            borderRadius={px2rem(12)}
            gap={8}
          >
            <HorizontalItem
              label={
                <Flex gap={2} alignItems={'center'}>
                  <Avatar
                    img={
                      'https://cdn.trustless.computer/upload/1683279635705685769-1683279635-name.png'
                    }
                    alt={'Name'}
                  />
                  <Text
                    fontSize={px2rem(16)}
                    color={'#FFFFFF'}
                    whiteSpace={'nowrap'}
                  >
                    Name
                  </Text>
                </Flex>
              }
              value={
                <Text fontSize={px2rem(16)} color={'#FFFFFFAA'}>
                  {tokenInfo?.name}
                </Text>
              }
            />
            <HorizontalItem
              label={
                <Flex gap={2} alignItems={'center'}>
                  <Avatar
                    img={
                      'https://cdn.trustless.computer/upload/1683280318769782896-1683280318-symbol.png'
                    }
                    alt={'Symbol'}
                  />
                  <Text
                    fontSize={px2rem(16)}
                    color={'#FFFFFF'}
                    whiteSpace={'nowrap'}
                  >
                    Symbol
                  </Text>
                </Flex>
              }
              value={
                <Text fontSize={px2rem(16)} color={'#FFFFFFAA'}>
                  {tokenInfo?.symbol}
                </Text>
              }
            />
            <HorizontalItem
              label={
                <Flex gap={2} alignItems={'center'}>
                  <Avatar
                    img={
                      'https://cdn.trustless.computer/upload/1683280358912483737-1683280358-total-supply.png'
                    }
                    alt={'Total supply'}
                  />
                  <Text
                    fontSize={px2rem(16)}
                    color={'#FFFFFF'}
                    whiteSpace={'nowrap'}
                  >
                    Total supply
                  </Text>
                </Flex>
              }
              value={
                <Text fontSize={px2rem(16)} color={'#FFFFFFAA'}>
                  {formatCurrency(tokenInfo?.totalSupply || 0)}
                </Text>
              }
            />
            <HorizontalItem
              label={
                <Flex gap={2} alignItems={'center'}>
                  <Avatar
                    img={
                      'https://cdn.trustless.computer/upload/1683280338812466905-1683280338-owner.png'
                    }
                    alt={'Owner'}
                  />
                  <Text
                    fontSize={px2rem(16)}
                    color={'#FFFFFF'}
                    whiteSpace={'nowrap'}
                  >
                    Owner
                  </Text>
                </Flex>
              }
              value={
                <Text fontSize={px2rem(16)} color={'#FFFFFFAA'}>
                  {shortenAddress(tokenInfo?.owner || '')}
                </Text>
              }
            />
          </Flex>
        </GridItem>
      </Grid>
    </form>
  );
});

const TradingForm = () => {
  const refForm = useRef<any>();
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useAppDispatch();
  const { account } = useWeb3React();
  const router = useRouter();
  const currentChain: IResourceChain = useSelector(selectPnftExchange).currentChain;

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

      const params = {
        network: currentChain?.chain?.toLowerCase()
      }

      const response = await updateTokenInfo(tokenInfo?.address, params, data);

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

export default TradingForm;
