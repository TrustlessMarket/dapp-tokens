/* eslint-disable react/no-children-prop */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {transactionType} from '@/components/Swap/alertInfoProcessing/types';
import FiledButton from '@/components/Swap/button/filedButton';
import WrapperConnected from '@/components/WrapperConnected';
import {TRUSTLESS_GASSTATION} from '@/constants/common';
import {toastError} from '@/constants/error';
import {AssetsContext} from '@/contexts/assets-context';
import useCastVoteProposal from '@/hooks/contract-operations/proposal/useCastVote';
import useContractOperation from '@/hooks/contract-operations/useContractOperation';
import useCountDownTimer from '@/hooks/useCountdown';
import {TransactionStatus} from '@/interfaces/walletTransaction';
import {PROPOSAL_STATUS,} from '@/modules/Proposal/Proposal.Status';
import {logErrorToServer} from '@/services/swap';
import {useAppDispatch, useAppSelector} from '@/state/hooks';
import {
  requestReload,
  requestReloadRealtime,
  selectPnftExchange,
  updateCurrentTransaction,
} from '@/state/pnftExchange';
import {compareString, formatCurrency} from '@/utils';
import {showError} from '@/utils/toast';
import {
  Box,
  Center,
  Flex,
  forwardRef,
  GridItem,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Text,
} from '@chakra-ui/react';
import {useWeb3React} from '@web3-react/core';
import BigNumber from 'bignumber.js';
import moment from 'moment';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {useCallback, useContext, useEffect, useImperativeHandle, useRef, useState} from 'react';
import {Field, Form, useForm, useFormState} from 'react-final-form';
import toast from 'react-hot-toast';
import {BiBell} from 'react-icons/bi';
import {useDispatch} from 'react-redux';
import styles from './styles.module.scss';
import cx from "classnames";
import px2rem from "@/utils/px2rem";
import FieldAmount from "@/components/Swap/form/fieldAmount";
import {composeValidators, required} from "@/utils/formValidate";
import {CDN_URL} from "@/configs";
import TokenBalance from "@/components/Swap/tokenBalance";
import InputWrapper from "@/components/Swap/form/inputWrapper";

export const MakeFormSwap = forwardRef((props, ref) => {
  const {
    onSubmit,
    submitting,
    proposalDetail,
    isStartingProposal,
    isPendingProposal,
    isEndProposal,
    canVote,
    votingToken,
  } = props;
  const [loading, setLoading] = useState(false);
  const [baseBalance, setBaseBalance] = useState<any>('0');
  const { juiceBalance, isLoadedAssets } = useContext(AssetsContext);
  const dispatch = useDispatch();
  const poolDetail = proposalDetail?.userPool;
  const { account, isActive: isAuthenticated } = useWeb3React();

  const [endTime, setEndTime] = useState(0);
  const [days, hours, minutes, seconds, expired] = useCountDownTimer(
    moment.unix(endTime).format('YYYY/MM/DD HH:mm:ss'),
  );

  // const onBaseAmountChange = useCallback(
  //   debounce((p) => handleBaseAmountChange(p), 1000),
  //   [],
  // );

  useEffect(() => {
    if (poolDetail?.id) {
      if (isPendingProposal) {
        setEndTime(moment(proposalDetail?.voteStart).unix());
      } else {
        setEndTime(moment(proposalDetail?.voteEnd).unix());
      }
    }
  }, [poolDetail?.id, isPendingProposal, isStartingProposal]);

  useEffect(() => {
    if (expired && endTime) {
      dispatch(requestReload());
    }
  }, [expired]);

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
  };

  useEffect(() => {
    change('baseBalance', baseBalance);
  }, [baseBalance]);

  const handleChangeMaxBaseAmount = () => {
    change('baseAmount', baseBalance);
    onChangeValueBaseAmount(baseBalance);
  };

  const validateBaseAmount = useCallback(
    (_amount: any) => {
      if (!_amount) {
        return undefined;
      }
      if (new BigNumber(_amount).lte(0)) {
        return `Required`;
      }
      if (new BigNumber(_amount).gt(baseBalance)) {
        return `Insufficient balance.`;
      }

      return undefined;
    },
    [values.baseAmount],
  );


  const onChangeValueBaseAmount = (amount: any) => {
    // onBaseAmountChange({
    //   amount,
    //   poolDetail,
    // });
  };

  // const handleBaseAmountChange = ({
  //   amount,
  //   poolDetail,
  // }: {
  //   amount: any;
  //   poolDetail: any;
  // }) => {
  //   try {
  //     if (!amount || isNaN(Number(amount))) return;
  //
  //     const quoteAmount = new BigNumber(amount)
  //       .div(new BigNumber(poolDetail?.totalValue || 0).plus(amount))
  //       .multipliedBy(poolDetail?.launchpadBalance || 0);
  //     change('quoteAmount', quoteAmount.toFixed());
  //   } catch (err: any) {
  //     logErrorToServer({
  //       type: 'error',
  //       address: account,
  //       error: JSON.stringify(err),
  //       message: err?.message,
  //       place_happen: 'handleBaseAmountChange',
  //     });
  //   }
  // };

  return (
    <form onSubmit={onSubmit} style={{ height: '100%' }}>
      <Flex gap={0} color={'#000000'} mt={4} direction={'column'}>
        <SimpleGrid columns={3} spacingX={6}>
          <GridItem>
            <Stat>
              <StatLabel>Rewards</StatLabel>
              <StatNumber>
                {formatCurrency(poolDetail?.launchpadBalance)}{' '}
                {poolDetail?.launchpadToken?.symbol}
              </StatNumber>
            </Stat>
          </GridItem>
          <GridItem>
            <Stat>
              <StatLabel>Funding Goal</StatLabel>
              <StatNumber>
                {formatCurrency(poolDetail?.goalBalance || 0)}{' '}
                {poolDetail?.votingToken?.symbol}
              </StatNumber>
            </Stat>
          </GridItem>
        </SimpleGrid>
        <Stat className={styles.infoColumn}>
          <StatLabel>
            {isPendingProposal
              ? 'Starts in'
              : isStartingProposal
              ? 'Ends in'
              : 'Ended at'}
          </StatLabel>
          <StatNumber>
            <Text>
              {isPendingProposal
                ? `${
                    Number(days) > 0 ? `${days}d :` : ''
                  } ${hours}h : ${minutes}m : ${seconds}s`
                : isStartingProposal
                ? `${
                    Number(days) > 0 ? `${days}d :` : ''
                  } ${hours}h : ${minutes}m : ${seconds}s`
                : moment(proposalDetail.voteEnd).format('LLL')}
            </Text>
          </StatNumber>
        </Stat>
      </Flex>
      <InputWrapper
        className={cx(styles.inputAmountWrap, styles.inputBaseAmountWrap)}
        theme="light"
        label={
          <Text fontSize={px2rem(14)} color={'#FFFFFF'}>
            Amount
          </Text>
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
                <Flex gap={1} alignItems={'center'} color={'#FFFFFF'} paddingX={2}>
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
                  <Flex
                    gap={1}
                    alignItems={'center'}
                    color={'#B6B6B6'}
                    fontSize={px2rem(16)}
                    fontWeight={'400'}
                  >
                    Balance:
                    <TokenBalance
                      token={votingToken}
                      onBalanceChange={(_amount) => setBaseBalance(_amount)}
                    />
                    {votingToken?.symbol}
                  </Flex>
                  <Text
                    cursor={'pointer'}
                    color={'#3385FF'}
                    onClick={handleChangeMaxBaseAmount}
                    bgColor={'#2E2E2E'}
                    borderRadius={'4px'}
                    padding={'1px 12px'}
                    fontSize={px2rem(16)}
                    fontWeight={'600'}
                  >
                    Max
                  </Text>
                </Flex>
              )
            }
            borderColor={'#353945'}
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
      {isAuthenticated && (
        <WrapperConnected type={'submit'} className={styles.submitButton}>
          <FiledButton
            isLoading={submitting}
            isDisabled={submitting || btnDisabled || !canVote}
            type="submit"
            processInfo={{
              id: transactionType.votingProposal,
            }}
            btnSize="h"
            containerConfig={{
              style: {
                width: '100%',
              },
            }}
            className={styles.btnVoteUp}
            onClick={() => change('isVoteUp', true)}
          >
            Vote
          </FiledButton>
        </WrapperConnected>
      )}
    </form>
  );
});

const BuyForm = ({ poolDetail, votingToken }: any) => {
  const refForm = useRef<any>();
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useAppDispatch();
  const { account, isActive } = useWeb3React();

  const needReload = useAppSelector(selectPnftExchange).needReload;
  const router = useRouter();
  const [voteSignatureProposal, setVoteSignatureProposal] = useState<any>();
  const [canVote, setCanVote] = useState(false);

  const { run: castVoteProposal } = useContractOperation({
    operation: useCastVoteProposal,
  });

  const handleSubmit = async (values: any) => {
    try {
      setSubmitting(true);
      dispatch(
        updateCurrentTransaction({
          status: TransactionStatus.info,
          id: transactionType.votingProposal,
        }),
      );

      let response;
      if (
        compareString(poolDetail?.creatorAddress, account) &&
        proposalDetail?.state === PROPOSAL_STATUS.Defeated
      ) {
        response = await defeatProposal({
          proposalId: proposalDetail?.proposalId,
        });
      } else if (
        compareString(poolDetail?.creatorAddress, account) &&
        proposalDetail?.state === PROPOSAL_STATUS.Succeeded
      ) {
        response = await executeProposal({
          proposalId: proposalDetail?.proposalId,
        });
      } else if (canVote) {
        const data = {
          proposalId: proposalDetail?.proposalId,
          weight: voteSignatureProposal?.weigthSign,
          support: values?.isVoteUp ? '1' : '0',
          signature: voteSignatureProposal?.adminSignature,
        };
        response = await castVoteProposal(data);
      }

      toast.success('Transaction has been created. Please wait for few minutes.');
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
          />
        )}
      </Form>
    </Box>
  );
};

export default BuyForm;
