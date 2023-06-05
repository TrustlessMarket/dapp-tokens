/* eslint-disable react/no-children-prop */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import FiledButton from '@/components/Swap/button/filedButton';
import WrapperConnected from '@/components/WrapperConnected';
import { toastError } from '@/constants/error';
import { AssetsContext } from '@/contexts/assets-context';
import useCountDownTimer from '@/hooks/useCountdown';
import { IProposal } from '@/interfaces/proposal';
import {
  PROPOSAL_STATUS,
  useProposalStatus,
} from '@/modules/Proposal/Proposal.Status';
import VoteForm from '@/modules/ProposalDetail/voteForm';
import { getUserVoteProposal, getVoteSignatureProposal } from '@/services/proposal';
import { logErrorToServer } from '@/services/swap';
import { useAppDispatch, useAppSelector } from '@/state/hooks';
import { closeModal, openModal } from '@/state/modal';
import {
  requestReload,
  selectPnftExchange,
  updateCurrentTransaction,
} from '@/state/pnftExchange';
import { compareString } from '@/utils';
import { showError } from '@/utils/toast';
import { Box, Flex, forwardRef } from '@chakra-ui/react';
import { useWindowSize } from '@trustless-computer/dapp-core';
import { useWeb3React } from '@web3-react/core';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useContext, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Form, useForm } from 'react-final-form';
import { useDispatch } from 'react-redux';
import styles from './styles.module.scss';
import {ILaunchpad} from "@/interfaces/launchpad";
import {TM_ADDRESS} from "@/configs";
import {LAUNCHPAD_STATUS, useLaunchPadStatus} from "@/modules/Launchpad/Launchpad.Status";

export const MakeFormSwap = forwardRef((props, ref) => {
  const {
    onSubmit,
    submitting,
    poolDetail,
  } = props;
  const [loading, setLoading] = useState(false);
  const [baseBalance, setBaseBalance] = useState<any>('0');
  const { juiceBalance, isLoadedAssets } = useContext(AssetsContext);
  const dispatch = useDispatch();
  const { account, isActive: isAuthenticated } = useWeb3React();

  const [endTime, setEndTime] = useState(0);
  const [days, hours, minutes, seconds, expired] = useCountDownTimer(
    moment.unix(endTime).format('YYYY/MM/DD HH:mm:ss'),
  );

  // useEffect(() => {
  //   if (poolDetail?.id) {
  //     if (isPendingProposal) {
  //       setEndTime(moment(proposalDetail?.voteStart).unix());
  //     } else {
  //       setEndTime(moment(proposalDetail?.voteEnd).unix());
  //     }
  //   }
  // }, [poolDetail?.id, isPendingProposal, isStartingProposal]);

  useEffect(() => {
    if (expired && endTime) {
      dispatch(requestReload());
    }
  }, [expired]);

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

  return (
    <form onSubmit={onSubmit} style={{ height: '100%' }}>
      {/* <Flex gap={0} color={'#FFFFFF'} mt={4} direction={'column'}>
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
                {poolDetail?.liquidityToken?.symbol}
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
      </Flex>*/}
      {/*{isAuthenticated &&
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
              <BiBell color="#FF7E21"/>
            </Center>
            <Text fontSize="sm" color="#FF7E21" textAlign={'left'}>
              Your TC balance is insufficient. Buy more TC{' '}
              <Link
                href={TRUSTLESS_GASSTATION}
                target={'_blank'}
                style={{textDecoration: 'underline'}}
              >
                here
              </Link>
              .
            </Text>
          </Flex>
        )}*/}
      <WrapperConnected type={'submit'} className={styles.submitButton}>
        <>
          {![LAUNCHPAD_STATUS.Voting].includes(poolDetail?.state)  && (
            <FiledButton
              isLoading={submitting}
              isDisabled={submitting || btnDisabled}
              type="submit"
              // processInfo={{
              //   id: transactionType.votingProposal,
              // }}
              btnSize="h"
              containerConfig={{
                style: {
                  width: '100%',
                },
              }}
              className={styles.btnVoteUp}
            >
              VOTE THIS LAUNCHPAD
            </FiledButton>
          )}
        </>
      </WrapperConnected>
    </form>
  );
});

const BuyForm = ({ poolDetail }: { poolDetail: ILaunchpad }) => {
  const refForm = useRef<any>();
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useAppDispatch();
  const { account, isActive } = useWeb3React();

  const { mobileScreen } = useWindowSize();
  const needReload = useAppSelector(selectPnftExchange).needReload;
  const router = useRouter();
  const [status] = useLaunchPadStatus({ row: poolDetail });
  // const isStarting = ![LAUNCHPAD_STATUS.Voting].includes(status.key);

  const votingToken = {
    address: TM_ADDRESS,
    thumbnail: 'https://i.ibb.co/TbshdC0/Icon-Token-TM-04.png',
    decimal: 18
  };

  const getUserVoteInfo = async () => {
    try {
      // const response = await Promise.all([
      //   getVoteSignatureProposal({
      //     address: account,
      //     proposal_id: router?.query?.proposal_id,
      //   }),
      //   getUserVoteProposal({
      //     address: account,
      //     proposal_id: router?.query?.proposal_id,
      //   }),
      // ]);
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    if (account && router?.query?.proposal_id) {
      getUserVoteInfo();
    }
  }, [
    account,
    isActive,
    router?.query?.proposal_id,
    poolDetail?.id,
    poolDetail?.state,
    needReload,
  ]);

  const handleConfirmVote = (values: any) => {
    const {} = values;
    const id = 'modalVoteConfirm';
    const close = () => dispatch(closeModal({ id }));
    dispatch(
      openModal({
        id,
        theme: 'dark',
        title: 'Confirm',
        className: styles.modalContent,
        modalProps: {
          centered: true,
          size: mobileScreen ? 'full' : 'xl',
          zIndex: 9999999,
        },
        render: () => (
          <Flex>
            <VoteForm poolDetail={poolDetail} votingToken={votingToken} onClose={close} />
          </Flex>
        ),
      }),
    );
  };

  const handleSubmit = async (values: any) => {
    try {
      let response;
      // if(compareString(poolDetail?.creatorAddress, account) && (proposalDetail?.state === PROPOSAL_STATUS.Defeated || proposalDetail?.state === PROPOSAL_STATUS.Succeeded)) {
      //   setSubmitting(true);
      //   dispatch(
      //     updateCurrentTransaction({
      //       status: TransactionStatus.info,
      //       id: transactionType.votingProposal,
      //     }),
      //   );
      //   if (proposalDetail?.state === PROPOSAL_STATUS.Defeated) {
      //     response = await defeatProposal({
      //       proposalId: proposalDetail?.proposalId,
      //     });
      //   } else if (proposalDetail?.state === PROPOSAL_STATUS.Succeeded) {
      //     response = await executeProposal({
      //       proposalId: proposalDetail?.proposalId,
      //     });
      //   }
      //   toast.success('Transaction has been created. Please wait for few minutes.');
      //   refForm.current?.reset();
      //   dispatch(requestReload());
      //   dispatch(requestReloadRealtime());
      // } else if (canVote) {
      //   handleConfirmVote(values);
      // }

      handleConfirmVote(values);

      // if (compareString(poolDetail?.creatorAddress, account) && proposalDetail?.state === PROPOSAL_STATUS.Defeated) {
      //   response = await defeatProposal({
      //     proposalId: proposalDetail?.proposalId,
      //   });
      // } else if (compareString(poolDetail?.creatorAddress, account) && ) {
      //   response = await executeProposal({
      //     proposalId: proposalDetail?.proposalId,
      //   });
      // } else if (canVote) {
      //   const data = {
      //     proposalId: proposalDetail?.proposalId,
      //     weight: voteSignatureProposal?.weigthSign,
      //     support: values?.isVoteUp ? "1" : "0",
      //     signature: voteSignatureProposal?.adminSignature
      //   }
      //   response = await castVoteProposal(data);
      // }
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
          />
        )}
      </Form>
    </Box>
  );
};

export default BuyForm;
