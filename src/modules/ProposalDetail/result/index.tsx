/* eslint-disable @typescript-eslint/no-explicit-any */

import {getVoteResultProposal} from "@/services/proposal";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {useAppSelector} from "@/state/hooks";
import {selectPnftExchange} from "@/state/pnftExchange";
import Side from "@/modules/ProposalDetail/result/side";
import {Box, Card, Flex, GridItem, SimpleGrid, Text} from "@chakra-ui/react";
import styles from './styles.module.scss';
import cx from 'classnames';
import px2rem from "@/utils/px2rem";
import moment from "moment";
import {useProposalStatus} from "@/modules/Proposal/Proposal.Status";
import {MdLocalFireDepartment} from "react-icons/md";
import CountDownTimer from "@/components/Countdown";

const ProposalResult = () => {
  const router = useRouter();
  const needReload = useAppSelector(selectPnftExchange).needReload;
  const [voteResult, setVoteResult] = useState<any>();
  const [status] = useProposalStatus({ row: voteResult?.userProposal });

  const forVotes = Number(voteResult?.userProposal?.forVotes || 0);
  const againstVotes = Number(voteResult?.userProposal?.againstVotes) || 0;

  const result = forVotes > againstVotes ? 1 : againstVotes > forVotes ? -1 : 0;

  console.log('voteResult', voteResult);
  console.log('status', status);

  const getVoteResultProposalInfo = async () => {
    try {
      const response = await getVoteResultProposal({
        proposal_id: router?.query?.proposal_id,
      });
      setVoteResult(response);
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    if (router?.query?.proposal_id) {
      getVoteResultProposalInfo();
    }
  }, [
    router?.query?.proposal_id,
    needReload,
  ]);

  return (
    <Box>
      <SimpleGrid columns={2} gap={6}>
        <GridItem>
          <Card bgColor={"transparent"} paddingX={6} paddingY={6} border={"1px solid #353945"}>
            <Side
              title={"For"}
              totalVote={voteResult?.forVote?.totalVoter + voteResult?.againstVote?.totalVoter}
              data={voteResult?.forVote}
              className={cx(styles.sideWrapper, styles.sideFor)}
            />
          </Card>
        </GridItem>
        {/*<GridItem>
          <Card bgColor={"transparent"} paddingX={6} paddingY={6} border={"1px solid #353945"}>
            <Side
              title={"Against"}
              totalVote={voteResult?.forVote?.totalVoter + voteResult?.againstVote?.totalVoter}
              data={voteResult?.againstVote}
              className={cx(styles.sideWrapper, styles.sideAgainst)}
            />
          </Card>
        </GridItem>*/}
        <GridItem>
          <Card bgColor={"transparent"} paddingX={6} paddingY={6} border={"1px solid #353945"} h={"100%"}>
            <Box color={"#FFFFFF"}>
              <Flex fontSize={px2rem(24)} fontWeight={500} alignItems={"center"} gap={1}>
                <Text color={"rgba(255, 255, 255, 0.7)"} >Current results:</Text>
                <Text color={result === 1 ? '#04C57F' : result === -1 ? '#BB0505' : '#FFFFFF'}>{result === 1 ? 'For' : result === -1 ? 'Against' : 'Equal'}</Text>
              </Flex>
              <Flex gap={3} mt={2}>
                <Flex gap={3} className={cx(styles.btnResult, result === 1 && styles.btnResultFor)}>
                  <Text>For</Text>
                  <Text>{voteResult?.forVote?.totalVoter} vote{voteResult?.forVote?.totalVoter > 1 ? 's' : ''}</Text>
                </Flex>
                <Flex gap={3} className={cx(styles.btnResult, result === -1 && styles.btnResultAgainst)}>
                  <Text>Against</Text>
                  <Text>{voteResult?.againstVote?.totalVoter} vote{voteResult?.againstVote?.totalVoter > 1 ? 's' : ''}</Text>
                </Flex>
              </Flex>
              <Box mt={8}>
                <Flex gap={1} fontSize={px2rem(24)} fontWeight={500}>
                  <Text color={"rgba(255, 255, 255, 0.7);"}>End:</Text>
                  <Text>{moment(voteResult?.userProposal?.voteEnd).format('LL')}</Text>
                </Flex>
                {
                  status.value === 'pending' ? (
                    <Flex className={styles.boxTime} gap={1} alignItems={"center"}>
                      <MdLocalFireDepartment fontSize={px2rem(20)}/>
                      <CountDownTimer end_time={voteResult?.userProposal?.voteStart}/>
                    </Flex>

                  ) : status.value === 'active' ? (
                    <Flex className={styles.boxTime} gap={1} alignItems={"center"}>
                      <MdLocalFireDepartment fontSize={px2rem(20)}/>
                      <CountDownTimer end_time={voteResult?.userProposal?.voteEnd}/>
                    </Flex>
                  ) : (
                    <Box></Box>
                  )
                }
              </Box>
            </Box>
          </Card>
        </GridItem>
      </SimpleGrid>
    </Box>
  );
}

export default ProposalResult;