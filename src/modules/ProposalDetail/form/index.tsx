/* eslint-disable react/no-children-prop */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import FiledButton from '@/components/Swap/button/filedButton';
import WrapperConnected from '@/components/WrapperConnected';
import VoteForm from '@/modules/ProposalDetail/voteForm';
import {useAppDispatch} from '@/state/hooks';
import {closeModal, openModal} from '@/state/modal';
import {Box, Flex, forwardRef, Text} from '@chakra-ui/react';
import {useWindowSize} from '@trustless-computer/dapp-core';
import {useWeb3React} from '@web3-react/core';
import {useImperativeHandle, useRef, useState} from 'react';
import {Form, useForm} from 'react-final-form';
import styles from './styles.module.scss';
import {ILaunchpad} from '@/interfaces/launchpad';
import px2rem from '@/utils/px2rem';
import {getTMAddress} from "@/utils";

export const MakeFormSwap = forwardRef((props, ref) => {
  const { onSubmit, submitting, poolDetail } = props;
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
          {isActive ? (
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
              Support this Project
            </FiledButton>
          ) : (
            'Support this Project'
          )}
        </>
      </WrapperConnected>
      {!isActive && (
        <Text
          fontSize={px2rem(14)}
          fontWeight={'400'}
          color={'rgba(255, 255, 255, 0.7)'}
          textAlign={'center'}
          mt={2}
        >
          Connect a wallet to vote.
        </Text>
      )}
    </form>
  );
});

const BuyForm = ({ poolDetail }: { poolDetail: ILaunchpad }) => {
  const refForm = useRef<any>();
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useAppDispatch();
  const { mobileScreen } = useWindowSize();

  const votingToken = {
    address: getTMAddress(),
    thumbnail: 'https://i.ibb.co/TbshdC0/Icon-Token-TM-04.png',
    decimal: 18,
    symbol: 'TM',
  };

  const handleSubmit = async (values: any) => {
    const {} = values;
    const id = 'modalVoteConfirm';
    const close = () => dispatch(closeModal({ id }));
    dispatch(
      openModal({
        id,
        theme: 'dark',
        title: 'Support this Project',
        className: styles.modalContent,
        modalProps: {
          centered: true,
          size: mobileScreen ? 'full' : 'xl',
          zIndex: 9999999,
        },
        render: () => (
          <Flex>
            <VoteForm
              poolDetail={poolDetail}
              votingToken={votingToken}
              onClose={close}
            />
          </Flex>
        ),
      }),
    );
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
