/* eslint-disable @typescript-eslint/no-explicit-any */

import React, {useEffect, useState} from "react";
import {useAppSelector} from "@/state/hooks";
import {selectPnftExchange} from "@/state/pnftExchange";
import Side from "@/modules/ProposalDetail/result/side";
import {Box, Card, GridItem, SimpleGrid} from "@chakra-ui/react";
import styles from './styles.module.scss';
import cx from 'classnames';
import {getVoteResultLaunchpad} from "@/services/launchpad";
import {ILaunchpad} from '@/interfaces/launchpad';

const ProposalResult = ({poolDetail}: { poolDetail: ILaunchpad }) => {
  const needReload = useAppSelector(selectPnftExchange).needReload;
  const [voteResult, setVoteResult] = useState<any>();

  const getVoteResultProposalInfo = async () => {
    try {
      const response = await getVoteResultLaunchpad({
        pool_address: poolDetail?.launchpad,
      });
      setVoteResult(response);
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    if (poolDetail?.launchpad) {
      getVoteResultProposalInfo();
    }
  }, [
    poolDetail?.launchpad,
    needReload,
  ]);

  return (
    <Box>
      <SimpleGrid columns={1} gap={6}>
        <GridItem>
          <Card bgColor={"transparent"} paddingX={6} paddingY={6} border={"1px solid #353945"}>
            <Side
              title={"For"}
              totalVote={Number(poolDetail?.voteGoal)}
              data={voteResult}
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
        {/*<GridItem>
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
        </GridItem>*/}
      </SimpleGrid>
    </Box>
  );
}

export default ProposalResult;