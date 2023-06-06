/* eslint-disable react/no-children-prop */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import FiledButton from '@/components/Swap/button/filedButton';
import WrapperConnected from '@/components/WrapperConnected';
import {toastError} from '@/constants/error';
import VoteForm from '@/modules/ProposalDetail/voteForm';
import {logErrorToServer} from '@/services/swap';
import {useAppDispatch} from '@/state/hooks';
import {closeModal, openModal} from '@/state/modal';
import {updateCurrentTransaction,} from '@/state/pnftExchange';
import {showError} from '@/utils/toast';
import {Box, Flex, forwardRef, Text} from '@chakra-ui/react';
import {useWindowSize} from '@trustless-computer/dapp-core';
import {useWeb3React} from '@web3-react/core';
import {useImperativeHandle, useRef, useState} from 'react';
import {Form, useForm} from 'react-final-form';
import styles from './styles.module.scss';
import {ILaunchpad} from "@/interfaces/launchpad";
import {TM_ADDRESS} from "@/configs";
import {LAUNCHPAD_STATUS} from "@/modules/Launchpad/Launchpad.Status";
import px2rem from "@/utils/px2rem";

export const MakeFormSwap = forwardRef((props, ref) => {
  const {
    onSubmit,
    submitting,
    poolDetail,
  } = props;
  const { isActive } = useWeb3React();

  const { change, restart } = useForm();

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

  return (
    <form onSubmit={onSubmit} style={{ height: '100%' }}>
      <WrapperConnected className={styles.submitButton}>
        <>
          {isActive && [LAUNCHPAD_STATUS.Voting].includes(poolDetail?.state) ? (
            <FiledButton
              isLoading={submitting}
              isDisabled={submitting}
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
              Support this Launchpad
            </FiledButton>
          ) : 'Support this Launchpad'
          }
        </>
      </WrapperConnected>
      {!isActive && <Text
          fontSize={px2rem(14)}
          fontWeight={"400"}
          color={"rgba(255, 255, 255, 0.7)"}
          textAlign={"center"}
          mt={2}
      >Connect a wallet to vote.</Text>
      }
    </form>
  );
});

const BuyForm = ({ poolDetail }: { poolDetail: ILaunchpad }) => {
  const refForm = useRef<any>();
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useAppDispatch();
  const { account, isActive } = useWeb3React();

  const { mobileScreen } = useWindowSize();

  const votingToken = {
    address: TM_ADDRESS,
    thumbnail: 'https://i.ibb.co/TbshdC0/Icon-Token-TM-04.png',
    decimal: 18,
    symbol: 'TM'
  };

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
