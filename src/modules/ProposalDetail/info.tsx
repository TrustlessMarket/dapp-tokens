/* eslint-disable @typescript-eslint/no-explicit-any */
import {Box, GridItem, SimpleGrid, Stat, StatLabel, StatNumber} from "@chakra-ui/react";
import {formatCurrency} from "@/utils";
import React from "react";
import {ILaunchpad} from "@/interfaces/launchpad";

const ProposalInfo = ({ poolDetail }: ILaunchpad | any) => {
  return (
    <Box color={"#FFFFFF"}>
      <SimpleGrid columns={4} spacingX={6}>
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
            <StatLabel>Hard Cap</StatLabel>
            <StatNumber>
              {
                Number(poolDetail?.thresholdBalance || 0) > 0 ? (
                  <>{formatCurrency(poolDetail?.thresholdBalance || 0)} {poolDetail?.liquidityToken?.symbol}</>
                ) : ('N/A')
              }
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
