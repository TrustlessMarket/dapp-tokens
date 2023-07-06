/* eslint-disable react/no-children-prop */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { transactionType } from '@/components/Swap/alertInfoProcessing/types';
import FiledButton from '@/components/Swap/button/filedButton';
import WrapperConnected from '@/components/WrapperConnected';
import { TRUSTLESS_GASSTATION } from '@/constants/common';
import { toastError } from '@/constants/error';
import { AssetsContext } from '@/contexts/assets-context';
import useContractOperation from '@/hooks/contract-operations/useContractOperation';
import { TransactionStatus } from '@/components/Swap/alertInfoProcessing/interface';
import { logErrorToServer } from '@/services/swap';
import { useAppDispatch, useAppSelector } from '@/state/hooks';
import {
  requestReload,
  requestReloadRealtime,
  selectPnftExchange,
  updateCurrentTransaction,
} from '@/state/pnftExchange';
import { showError } from '@/utils/toast';
import { Box, Center, Flex, forwardRef, Text } from '@chakra-ui/react';
import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import Link from 'next/link';
import {
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Field, Form, useForm, useFormState } from 'react-final-form';
import toast from 'react-hot-toast';
import { BiBell } from 'react-icons/bi';
import { useDispatch } from 'react-redux';
import styles from './styles.module.scss';
import cx from 'classnames';
import px2rem from '@/utils/px2rem';
import FieldAmount from '@/components/Swap/form/fieldAmount';
import { composeValidators, required } from '@/utils/formValidate';
import { CDN_URL } from '@/configs';
import TokenBalance from '@/components/Swap/tokenBalance';
import InputWrapper from '@/components/Swap/form/inputWrapper';
import Web3 from 'web3';
import { IToken } from '@/interfaces/token';
import useIsApproveERC20Token from '@/hooks/contract-operations/token/useIsApproveERC20Token';
import useBalanceERC20Token from '@/hooks/contract-operations/token/useBalanceERC20Token';
import useApproveERC20Token from '@/hooks/contract-operations/token/useApproveERC20Token';
import { closeModal, openModal } from '@/state/modal';
import ModalConfirmApprove from '@/components/ModalConfirmApprove';
import useVoteLaunchpad from '@/hooks/contract-operations/launchpad/useVote';
import moment from 'moment';
import { colors } from '@/theme/colors';
import {scanLaunchpadTxHash} from "@/services/launchpad";
import {IResourceChain} from "@/interfaces/chain";

const validateBaseAmount = (_amount: any, values: any) => {
  if (!_amount) {
    return undefined;
  }
  if (new BigNumber(_amount).lte(0)) {
    return `Required`;
  }
  if (new BigNumber(_amount).gt(values?.baseBalance)) {
    return `Unfortunately, you don’t have have enough TM to vote. But don’t worry, stay tuned for updates regarding our next airdrop on our Discord channel.`;
  }

  return undefined;
};

export const MakeFormSwap = forwardRef((props, ref) => {
  const { onSubmit, submitting, isStartingProposal, poolDetail, votingToken } =
    props;
  const [loading, setLoading] = useState(false);
  const [baseBalance, setBaseBalance] = useState<any>('0');
  const { juiceBalance, isLoadedAssets } = useContext(AssetsContext);
  const dispatch = useDispatch();
  const { account, isActive: isAuthenticated } = useWeb3React();
  const [amountBaseTokenApproved, setAmountBaseTokenApproved] = useState('0');
  const { call: isApproved } = useIsApproveERC20Token();
  const { call: tokenBalance } = useBalanceERC20Token();
  const { call: approveToken } = useApproveERC20Token();
  const configs = useAppSelector(selectPnftExchange).configs;

  const { values } = useFormState();
  const { change, restart } = useForm();
  const btnDisabled = loading;

  useImperativeHandle(ref, () => {
    return {
      reset: reset,
    };
  });

  const reset = async () => {
    restart({
      // baseToken: values?.baseToken,
      // quoteToken: values?.quoteToken,
    });

    try {
      const [_baseBalance] = await Promise.all([
        getTokenBalance(votingToken),
        // getTokenBalance(values?.quoteToken),
      ]);
      setBaseBalance(_baseBalance);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    change('baseBalance', baseBalance);
  }, [baseBalance]);

  const isRequireApprove = useMemo(() => {
    let result = false;
    try {
      result =
        isAuthenticated &&
        values?.baseAmount &&
        !isNaN(Number(values?.baseAmount)) &&
        new BigNumber(amountBaseTokenApproved || 0).lt(
          Web3.utils.toWei(`${values?.baseAmount || 0}`, 'ether'),
        );
    } catch (err: any) {
      logErrorToServer({
        type: 'error',
        address: account,
        error: JSON.stringify(err),
        message: err?.message,
        place_happen: 'isRequireApprove',
      });
    }

    return result;
  }, [isAuthenticated, amountBaseTokenApproved, values?.baseAmount]);

  useEffect(() => {
    if (account && votingToken?.address && poolDetail?.launchpad) {
      checkApproveBaseToken(votingToken);
    }
  }, [account, votingToken?.address, poolDetail?.launchpad]);

  const checkApproveBaseToken = async (token: any) => {
    const [_isApprove] = await Promise.all([checkTokenApprove(token)]);
    setAmountBaseTokenApproved(_isApprove);
  };

  const checkTokenApprove = async (token: IToken) => {
    try {
      const response = await isApproved({
        erc20TokenAddress: token.address,
        address: poolDetail?.launchpad,
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
      const response: any = await approveToken({
        erc20TokenAddress: token.address,
        address: poolDetail?.launchpad,
      });
      dispatch(
        updateCurrentTransaction({
          status: TransactionStatus.success,
          id: transactionType.createPoolApprove,
          hash: response.hash,
          infoTexts: {
            success: `${token.symbol} has been approved successfully. You can swap now!`,
          },
        }),
      );
    } catch (error) {
      throw error;
    } finally {
      // dispatch(updateCurrentTransaction(null));
    }
  };

  const handleChangeMaxBaseAmount = () => {
    change('baseAmount', baseBalance);
    // onChangeValueBaseAmount(baseBalance);
  };

  const onChangeValueBaseAmount = (amount: any) => {
    // onBaseAmountChange({
    //   amount,
    //   poolDetail,
    // });
  };

  const onShowModalApprove = () => {
    const id = 'modal';
    const onClose = () => dispatch(closeModal({ id }));
    dispatch(
      openModal({
        id,
        theme: 'dark',
        title: `APPROVE USE OF ${votingToken?.symbol}`,
        className: styles.modalContent,
        modalProps: {
          centered: true,
          // size: mobileScreen ? 'full' : 'xl',
          zIndex: 9999999,
        },
        render: () => (
          <ModalConfirmApprove onApprove={onApprove} onClose={onClose} />
        ),
      }),
    );
  };

  const onApprove = async () => {
    try {
      setLoading(true);
      await requestApproveToken(votingToken);
      checkApproveBaseToken(votingToken);

      // toast.success('Transaction has been created. You can swap now!');
    } catch (err: any) {
      logErrorToServer({
        type: 'error',
        address: account,
        error: JSON.stringify(err),
        message: err?.message,
      });
      toastError(showError, err, { address: account });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} style={{ height: '100%' }}>
      <Text color={'#1C1C1C'}>
        Your vote will confirm your support for this project. Note, that when you
        pledge your token onto the platform, it stays locked for 30 days and earns{' '}
        {configs?.percentRewardForVoter}% of the total funds raised, paid via project
        tokens.
      </Text>
      <InputWrapper
        className={cx(styles.inputAmountWrap, styles.inputBaseAmountWrap)}
        theme="light"
        label={
          <Text fontSize={px2rem(14)} color={'#FFFFFF'}>
            Amount
          </Text>
        }
        rightLabel={
          votingToken && (
            <Flex
              gap={1}
              alignItems={'center'}
              color={colors.darkBorderColor}
              fontSize={px2rem(14)}
              fontWeight={'400'}
            >
              Balance:
              <TokenBalance
                token={votingToken}
                onBalanceChange={(_amount) => setBaseBalance(_amount)}
              />
              {votingToken?.symbol}
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
            disabled={submitting}
            // placeholder={"Enter number of tokens"}
            decimals={votingToken?.decimal || 18}
            className={styles.inputAmount}
            prependComp={
              votingToken && (
                <Flex
                  gap={1}
                  alignItems={'center'}
                  color={'#000000'}
                  paddingX={2}
                  height={'100%'}
                >
                  <img
                    src={
                      votingToken?.thumbnail ||
                      `${CDN_URL}/upload/1683530065704444020-1683530065-default-coin.svg`
                    }
                    alt={votingToken?.thumbnail || 'default-icon'}
                    className={'avatar'}
                  />
                  <Text fontSize={'sm'}>{votingToken?.symbol}</Text>
                </Flex>
              )
            }
            appendComp={
              votingToken && (
                <Flex gap={2} fontSize={px2rem(14)} color={'#FFFFFF'}>
                  <Text
                    cursor={'pointer'}
                    color={'#3385FF'}
                    onClick={handleChangeMaxBaseAmount}
                    // bgColor={"rgba(0, 0, 0, 0.2)"}
                    borderRadius={'4px'}
                    padding={'1px 12px'}
                    fontSize={px2rem(16)}
                    fontWeight={'600'}
                    border={'1px solid #3385FF'}
                  >
                    Max
                  </Text>
                </Flex>
              )
            }
            borderColor={'#ECECED'}
          />
        </Flex>
      </InputWrapper>
      {isAuthenticated &&
        isStartingProposal &&
        isLoadedAssets &&
        new BigNumber(juiceBalance || 0).lte(0) && (
          <Flex gap={3} mt={2}>
            <Center
              w={'24px'}
              h={'24px'}
              borderRadius={'50%'}
              bg={'rgba(255, 126, 33, 0.2)'}
              as={'span'}
            >
              <BiBell color="#FF7E21" />
            </Center>
            <Text fontSize="sm" color="#FF7E21" textAlign={'left'}>
              Your TC balance is insufficient. Buy more TC{' '}
              <Link
                href={TRUSTLESS_GASSTATION}
                target={'_blank'}
                style={{ textDecoration: 'underline' }}
              >
                here
              </Link>
              .
            </Text>
          </Flex>
        )}
      <Box mt={6} />
      {isAuthenticated && (
        <WrapperConnected
          type={isRequireApprove ? 'button' : 'submit'}
          className={styles.submitButton}
        >
          {isRequireApprove ? (
            <FiledButton
              isLoading={loading}
              isDisabled={loading}
              loadingText="Processing"
              btnSize={'h'}
              containerConfig={{ flex: 1 }}
              onClick={onShowModalApprove}
              processInfo={{
                id: transactionType.createPoolApprove,
                theme: 'light',
              }}
            >
              APPROVE USE OF {votingToken?.symbol}
            </FiledButton>
          ) : (
            <FiledButton
              isDisabled={submitting || btnDisabled}
              isLoading={submitting}
              type="submit"
              btnSize={'h'}
              containerConfig={{ flex: 1 }}
              loadingText={submitting ? 'Processing' : ' '}
              processInfo={{
                id: transactionType.votingProposal,
                theme: 'light',
              }}
            >
              VOTE
            </FiledButton>
          )}
        </WrapperConnected>
      )}
    </form>
  );
});

const BuyForm = ({ poolDetail, votingToken, onClose }: any) => {
  const refForm = useRef<any>();
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useAppDispatch();
  const { account, isActive } = useWeb3React();
  const currentChain: IResourceChain = useAppSelector(selectPnftExchange).currentChain;

  const { run: voteLaunchpad } = useContractOperation({
    operation: useVoteLaunchpad,
  });

  const handleSubmit = async (values: any) => {
    if (moment().unix() >= moment(poolDetail?.voteEnd).unix()) {
      toast.error('This project is overdue for voting.');
      return;
    }
    const { baseAmount } = values;
    try {
      setSubmitting(true);
      dispatch(
        updateCurrentTransaction({
          status: TransactionStatus.info,
          id: transactionType.votingProposal,
        }),
      );

      const data = {
        amount: baseAmount,
        launchpadAddress: poolDetail?.launchpad,
      };
      const response = await voteLaunchpad(data);

      await scanLaunchpadTxHash({
        tx_hash: response.hash,
        network: currentChain?.chain?.toLowerCase()
      });

      toast.success('Transaction has been created. Please wait for few minutes.');
      refForm.current?.reset();
      dispatch(requestReload());
      dispatch(requestReloadRealtime());
      onClose && onClose();
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
            poolDetail={poolDetail}
            votingToken={votingToken}
            onClose={onClose}
          />
        )}
      </Form>
    </Box>
  );
};

export default BuyForm;
