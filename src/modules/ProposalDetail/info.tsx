/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  GridItem,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
} from '@chakra-ui/react';
import {compareString, formatCurrency} from '@/utils';
import React from 'react';
import { ILaunchpad } from '@/interfaces/launchpad';
import InfoTooltip from '@/components/Swap/infoTooltip';
import CountDownTimer from '@/components/Countdown';
import {useAppSelector} from "@/state/hooks";
import {selectPnftExchange} from "@/state/pnftExchange";
import {useWeb3React} from "@web3-react/core";

const ProposalInfo = ({ poolDetail }: ILaunchpad | any) => {
  const configs = useAppSelector(selectPnftExchange).configs;
  const { account } = useWeb3React();
  const isLaunchpadCreator = compareString(poolDetail?.creatorAddress, account);

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
                label={`The minimum amount ${isLaunchpadCreator ? 'you' : 'that the project'} would like to raise. If the crowdfunding does not reach the Funding Goal, the funded amount will be returned to the contributors`}
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
                label={`The maximum amount ${isLaunchpadCreator ? 'you' : 'that the project'} would like to raise. The crowdfunding will stop upon reaching its hard cap`}
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
      </SimpleGrid>
    </Box>
  );
};

export default ProposalInfo;
