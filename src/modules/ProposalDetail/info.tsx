/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  GridItem,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
} from '@chakra-ui/react';
import { formatCurrency } from '@/utils';
import React from 'react';
import { ILaunchpad } from '@/interfaces/launchpad';
import InfoTooltip from '@/components/Swap/infoTooltip';
import CountDownTimer from '@/components/Countdown';
import {useAppSelector} from "@/state/hooks";
import {selectPnftExchange} from "@/state/pnftExchange";

const ProposalInfo = ({ poolDetail }: ILaunchpad | any) => {
  const configs = useAppSelector(selectPnftExchange).configs;
  return (
    <Box color={'#FFFFFF'}>
      <SimpleGrid columns={5} spacingX={6}>
        <GridItem>
          <Stat>
            <StatLabel>
              <InfoTooltip
                showIcon={true}
                label="The total number of tokens that the contributors will receive after the crowdfunding ends."
              >
                Reward Pool
              </InfoTooltip>
            </StatLabel>
            <StatNumber>
              {formatCurrency(poolDetail?.launchpadBalance)}{' '}
              {poolDetail?.launchpadToken?.symbol}
            </StatNumber>
          </Stat>
        </GridItem>
        <GridItem>
          <Stat>
            <StatLabel>
              <InfoTooltip
                showIcon={true}
                label="The minimum amount that the project would like to raise. If the crowdfunding does not reach the Funding Goal, the funded amount will be returned to the contributors"
              >
                Funding Goal
              </InfoTooltip>
            </StatLabel>
            <StatNumber>
              {formatCurrency(poolDetail?.goalBalance || 0)}{' '}
              {poolDetail?.liquidityToken?.symbol}
            </StatNumber>
          </Stat>
        </GridItem>
        <GridItem>
          <Stat>
            <StatLabel>
              <InfoTooltip
                showIcon={true}
                label="The maximum amount that the project would like to raise. The crowdfunding will stop upon reaching its hard cap"
              >
                Hard Cap
              </InfoTooltip>
            </StatLabel>
            <StatNumber>
              {Number(poolDetail?.thresholdBalance || 0) > 0 ? (
                <>
                  {formatCurrency(poolDetail?.thresholdBalance || 0)}{' '}
                  {poolDetail?.liquidityToken?.symbol}
                </>
              ) : (
                'N/A'
              )}
            </StatNumber>
          </Stat>
        </GridItem>
        <GridItem>
          <Stat>
            <StatLabel>
              Reward for Supporters
            </StatLabel>
            <StatNumber>
              {configs?.percentRewardForVoter}% funded
            </StatNumber>
          </Stat>
        </GridItem>
        <GridItem>
          <Stat>
            <StatLabel>
              Voting Ends in
            </StatLabel>
            <StatNumber>
              <CountDownTimer end_time={poolDetail.voteEnd} />
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
