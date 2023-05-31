/* eslint-disable react/no-children-prop */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {transactionType} from '@/components/Swap/alertInfoProcessing/types';
import FiledButton from '@/components/Swap/button/filedButton';
import WrapperConnected from '@/components/WrapperConnected';
import {TRUSTLESS_GASSTATION} from '@/constants/common';
import {toastError} from '@/constants/error';
import {AssetsContext} from '@/contexts/assets-context';
import {TransactionStatus} from '@/interfaces/walletTransaction';
import {logErrorToServer} from '@/services/swap';
import {useAppDispatch, useAppSelector} from '@/state/hooks';
import {
    requestReload,
    requestReloadRealtime,
    selectPnftExchange,
    updateCurrentTransaction,
} from '@/state/pnftExchange';
import {compareString, formatCurrency} from '@/utils';
import px2rem from '@/utils/px2rem';
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
import BigNumber from 'bignumber.js';
import Link from 'next/link';
import {useRouter} from 'next/router';
import React, {useContext, useEffect, useImperativeHandle, useRef, useState,} from 'react';
import {Form, useForm} from 'react-final-form';
import toast from 'react-hot-toast';
import {useDispatch} from 'react-redux';
import styles from './styles.module.scss';
import {BiBell} from 'react-icons/bi';
import {useWindowSize} from '@trustless-computer/dapp-core';
import SocialToken from '@/components/Social';
import moment from 'moment';
import useCountDownTimer from '@/hooks/useCountdown';
import {IProposal} from '@/interfaces/proposal';
import {PROPOSAL_STATUS, useProposalStatus,} from '@/modules/Proposal/list/Proposal.Status';
import {getVoteSignatureProposal} from '@/services/proposal';
import useContractOperation from '@/hooks/contract-operations/useContractOperation';
import useDefeatProposal from '@/hooks/contract-operations/proposal/useDefeat';
import useExecuteProposal from '@/hooks/contract-operations/proposal/useExecute';
import useCastVoteProposal from '@/hooks/contract-operations/proposal/useCastVote';
import useTCWallet from '@/hooks/useTCWallet';

export const MakeFormSwap = forwardRef((props, ref) => {
    const {
        onSubmit,
        submitting,
        proposalDetail,
        isStartingProposal,
        isPendingProposal,
        isEndProposal,
        canVote,
    } = props;
    const [loading, setLoading] = useState(false);
    const [baseBalance, setBaseBalance] = useState<any>('0');
    const {juiceBalance, isLoadedAssets} = useContext(AssetsContext);
    const dispatch = useDispatch();
    const poolDetail = proposalDetail?.userPool;
    const {tcWalletAddress: account, isAuthenticated} = useTCWallet();

    const [endTime, setEndTime] = useState(0);
    const [days, hours, minutes, seconds, expired] = useCountDownTimer(
        moment.unix(endTime).format('YYYY/MM/DD HH:mm:ss'),
    );

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

    const {change, restart} = useForm();
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
        <form onSubmit={onSubmit} style={{height: '100%'}}>
            <Flex gap={0} color={'#FFFFFF'} mt={4} direction={'column'}>
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
            </Flex>
            {/*<Box mt={1}>
        <HorizontalItem
          label={
            <Text fontSize={'sm'} fontWeight={'medium'} color={'rgba(255, 255, 255, 0.7)'}>
              FEE: {FEE * (swapRoutes?.length || 1)}%
            </Text>
          }
        />
      </Box>*/}
            {/*{baseToken && quoteToken && values?.baseAmount && Number(exchangeRate) > 0 && (
        <Box mt={1}>
          <HorizontalItem
            label={
              <Text fontSize={'sm'} fontWeight={'medium'} color={'#FFFFFF'}>
                1 {quoteToken?.symbol} =&nbsp;
                {formatCurrency(exchangeRate.toString(), baseToken?.decimal || 18)}
                &nbsp;{baseToken?.symbol}
              </Text>
            }
          />
        </Box>
      )}*/}
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
                )}
            {
                isAuthenticated && (
                    <WrapperConnected type={'submit'} className={styles.submitButton}>
                        {compareString(poolDetail.creatorAddress, account) ? (
                            <>
                                {proposalDetail?.state === PROPOSAL_STATUS.Defeated && (
                                    <FiledButton
                                        isDisabled={submitting || btnDisabled}
                                        isLoading={submitting}
                                        type="submit"
                                        btnSize={'h'}
                                        containerConfig={{flex: 1, mt: 6}}
                                        loadingText={submitting ? 'Processing' : ' '}
                                        processInfo={{
                                            id: transactionType.votingProposal,
                                        }}
                                        className={styles.btnDefeat}
                                    >
                                        DEFEAT THIS PROPOSAL
                                    </FiledButton>
                                )}
                                {proposalDetail?.state === PROPOSAL_STATUS.Succeeded && (
                                    <FiledButton
                                        isDisabled={submitting || btnDisabled}
                                        isLoading={submitting}
                                        type="submit"
                                        btnSize={'h'}
                                        containerConfig={{flex: 1, mt: 6}}
                                        loadingText={submitting ? 'Processing' : ' '}
                                        processInfo={{
                                            id: transactionType.votingProposal,
                                        }}
                                        className={styles.btnExecute}
                                    >
                                        EXECUTE THIS PROPOSAL
                                    </FiledButton>
                                )}
                            </>
                        ) : (
                            <>
                            </>
                        )}
                        {proposalDetail?.state === PROPOSAL_STATUS.Active && canVote && (
                            <Flex width={'100%'} justifyContent={'center'} gap={6}>
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
                                    Vote Up
                                </FiledButton>
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
                                    className={styles.btnVoteDown}
                                    onClick={() => change('isVoteDown', true)}
                                >
                                    Vote down
                                </FiledButton>
                            </Flex>
                        )}
                    </WrapperConnected>
                )
            }
            <Flex justifyContent={'flex-end'} mt={4}>
                <SocialToken socials={poolDetail?.launchpadToken?.social}/>
            </Flex>
            <Text mt={4} fontSize={px2rem(20)} fontWeight={'300'} color={'#FFFFFF'}>
                The voting will end by{' '}
                {moment.utc(proposalDetail?.voteEnd).format('ddd, MMMM Do YYYY HH:mm:ss Z')}.
            </Text>
        </form>
    )
        ;
});

const BuyForm = ({proposalDetail}: { proposalDetail: IProposal }) => {
    const refForm = useRef<any>();
    const [submitting, setSubmitting] = useState(false);
    const dispatch = useAppDispatch();
    const {tcWalletAddress: account, isAuthenticated: isActive} = useTCWallet();

    const {mobileScreen} = useWindowSize();
    const [status] = useProposalStatus({row: proposalDetail});
    const poolDetail = proposalDetail?.userPool;
    const needReload = useAppSelector(selectPnftExchange).needReload;
    const router = useRouter();
    const [voteSignatureProposal, setVoteSignatureProposal] = useState<any>();
    const [canVote, setCanVote] = useState(false);

    console.log('voteSignatureProposal', voteSignatureProposal);
    console.log('canVote', canVote);

    const {run: defeatProposal} = useContractOperation({
        operation: useDefeatProposal,
    });

    const {run: executeProposal} = useContractOperation({
        operation: useExecuteProposal,
    });

    const {run: castVoteProposal} = useContractOperation({
        operation: useCastVoteProposal,
    });

    const isEndProposal = [
        PROPOSAL_STATUS.Canceled,
        PROPOSAL_STATUS.Defeated,
        PROPOSAL_STATUS.Succeeded,
        PROPOSAL_STATUS.Queued,
        PROPOSAL_STATUS.Expired,
        PROPOSAL_STATUS.Executed,
        PROPOSAL_STATUS.Closed,
    ].includes(status.key);

    const isStarting = [PROPOSAL_STATUS.Active].includes(status.key);
    const isPending = [PROPOSAL_STATUS.Pending].includes(status.key);

    const getVoteSignatureProposalInfo = async () => {
        try {
            const response = await getVoteSignatureProposal({
                address: account,
                proposal_id: router?.query?.proposal_id,
            });
            setVoteSignatureProposal(response);
            setCanVote(!!response);
        } catch (err) {
            throw err;
        }
    };

    useEffect(() => {
        if (account && router?.query?.proposal_id) {
            getVoteSignatureProposalInfo();
        }
    }, [account, router?.query?.proposal_id, needReload]);

    useEffect(() => {
        if (account && router?.query?.proposal_id) {
            getVoteSignatureProposalInfo();
        }
    }, [
        account,
        isActive,
        router?.query?.proposal_id,
        proposalDetail?.id,
        proposalDetail?.state,
        needReload,
    ]);

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
            if (compareString(poolDetail?.creatorAddress, account)) {
                if (proposalDetail?.state === PROPOSAL_STATUS.Defeated) {
                    response = await defeatProposal({
                        proposalId: proposalDetail?.proposalId,
                    });
                } else if (proposalDetail?.state === PROPOSAL_STATUS.Succeeded) {
                    response = await executeProposal({
                        proposalId: proposalDetail?.proposalId,
                    });
                }
            } else if (canVote) {
                const data = {
                    proposalId: proposalDetail?.proposalId,
                    weight: voteSignatureProposal?.weightSign,
                    support: values?.isVoteUp ? "1" : "0",
                    signature: voteSignatureProposal?.adminSignature
                }
                console.log('dataaaaaa', data);
                response = await castVoteProposal(data);
            }

            console.log('response', response);

            toast.success('Transaction has been created. Please wait for few minutes.');
            refForm.current?.reset();
            dispatch(requestReload());
            dispatch(requestReloadRealtime());
        } catch (err: any) {
            toastError(showError, err, {address: account});
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
                {({handleSubmit}) => (
                    <MakeFormSwap
                        ref={refForm}
                        onSubmit={handleSubmit}
                        submitting={submitting}
                        poolDetail={poolDetail}
                        proposalDetail={proposalDetail}
                        isStartingProposal={isStarting}
                        isPendingProposal={isPending}
                        isEndProposal={isEndProposal}
                        canVote={canVote}
                    />
                )}
            </Form>
        </Box>
    );
};

export default BuyForm;
