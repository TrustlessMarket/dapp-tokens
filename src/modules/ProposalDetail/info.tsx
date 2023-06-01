/* eslint-disable @typescript-eslint/no-explicit-any */
import {IProposal} from "@/interfaces/proposal";
import {Box, GridItem, SimpleGrid, Stat, StatLabel, StatNumber} from "@chakra-ui/react";
import {formatCurrency} from "@/utils";
import React from "react";

const ProposalInfo = ({ proposalDetail }: IProposal | any) => {
  // const [status] = useProposalStatus({ row: proposalDetail });
  const poolDetail = proposalDetail?.userPool;

  return (
    <Box color={"#FFFFFF"}>
      <SimpleGrid columns={3} spacingX={6}>
        <GridItem>
          <Stat>
            <StatLabel>Rewards</StatLabel>
            <StatNumber>{formatCurrency(poolDetail?.launchpadBalance)} {poolDetail?.launchpadToken?.symbol}</StatNumber>
          </Stat>
        </GridItem>
        <GridItem>
          <Stat>
            <StatLabel>Funding Goal</StatLabel>
            <StatNumber>
              {formatCurrency(poolDetail?.goalBalance || 0)} {poolDetail?.liquidityToken?.symbol}
            </StatNumber>
          </Stat>
        </GridItem>
        <GridItem>
          <Stat>
            <StatLabel>Threshold</StatLabel>
            <StatNumber>
              {formatCurrency(poolDetail?.goalBalance || 0)} {poolDetail?.liquidityToken?.symbol}
            </StatNumber>
          </Stat>
        </GridItem>
        {/*{
          status.value === 'pending' ? (
            <GridItem>
              <Stat>
                <StatLabel>Starts at</StatLabel>
                <StatNumber>
                  <Flex mt={1} alignItems={'center'} gap={2}>
                    <ImClock2/>
                    <Text>
                      <CountDownTimer end_time={proposalDetail.voteStart}/>
                    </Text>
                  </Flex>
                </StatNumber>
              </Stat>
            </GridItem>
          ) : status.value === 'active' ? (
            <GridItem>
              <Stat>
                <StatLabel>Ends at</StatLabel>
                <StatNumber>
                  <Flex mt={1} alignItems={'center'} gap={2}>
                    <ImClock2/>
                    <Text>
                      <CountDownTimer end_time={proposalDetail.voteEnd}/>
                    </Text>
                  </Flex>
                </StatNumber>
              </Stat>
            </GridItem>
          ) : (
            <GridItem>
              <Stat>
                <StatLabel>Ends at</StatLabel>
                <StatNumber>
                  <Flex mt={1} alignItems={'center'} gap={2}>
                    <ImClock2/>
                    <Text>{moment(proposalDetail.voteEnd).format('LL')}</Text>
                  </Flex>
                </StatNumber>
              </Stat>
            </GridItem>
          )
        }*/}
      </SimpleGrid>
    </Box>
  );
};

export default ProposalInfo;
