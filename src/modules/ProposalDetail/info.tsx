/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Flex,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Tooltip,
} from '@chakra-ui/react';
import {
  abbreviateNumber,
  calcLaunchpadInitialPrice,
  compareString,
  formatCurrency,
  getTokenIconUrl,
} from '@/utils';
import React from 'react';
import { ILaunchpad } from '@/interfaces/launchpad';
import InfoTooltip from '@/components/Swap/infoTooltip';
import CountDownTimer from '@/components/Countdown';
import { useAppSelector } from '@/state/hooks';
import { selectPnftExchange } from '@/state/pnftExchange';
import { useWeb3React } from '@web3-react/core';
import { LAUNCHPAD_STATUS } from '@/modules/Launchpad/Launchpad.Status';
import moment from 'moment/moment';
import styles from '@/modules/LaunchPadDetail/form/styles.module.scss';
import { CDN_URL } from '@/configs';
import { IToken } from '@/interfaces/token';

const ProposalInfo = ({ poolDetail }: ILaunchpad | any) => {
  const configs = useAppSelector(selectPnftExchange).configs;
  const { account } = useWeb3React();
  const isLaunchpadCreator = compareString(poolDetail?.creatorAddress, account);
  const liquidityToken: IToken = poolDetail?.liquidityToken;

  return (
    <Box color={'#FFFFFF'}>
      <SimpleGrid columns={[1, 3]} spacingY={8} spacingX={8}>
        <Stat className={styles.infoColumn}>
          <StatLabel>
            <InfoTooltip
              showIcon={true}
              label="The total number of tokens that the contributors will receive after the crowdfunding ends."
            >
              Reward Pool
            </InfoTooltip>
          </StatLabel>
          <StatNumber>
            <Tooltip label={`${formatCurrency(poolDetail?.launchpadBalance)}`}>
              {abbreviateNumber(poolDetail?.launchpadBalance)}
            </Tooltip>
            {` `}
            {poolDetail?.launchpadToken?.symbol}
          </StatNumber>
        </Stat>
        <Stat className={styles.infoColumn}>
          <StatLabel>
            <InfoTooltip
              showIcon={true}
              label={`The minimum amount ${
                isLaunchpadCreator ? 'you' : 'that the project'
              } would like to raise. If the crowdfunding does not reach the Funding Goal, the funded amount will be returned to the contributors`}
            >
              {`Funding goal`}
            </InfoTooltip>
          </StatLabel>
          <StatNumber>
            <Flex gap={1} alignItems={'center'}>
              {formatCurrency(poolDetail?.goalBalance || 0)}
              <img
                src={getTokenIconUrl(liquidityToken)}
                alt={liquidityToken?.thumbnail || 'default-icon'}
                className={'liquidity-token-avatar'}
              />
            </Flex>
          </StatNumber>
        </Stat>
        <Stat className={styles.infoColumn}>
          <StatLabel>
            <InfoTooltip
              showIcon={true}
              label={`The maximum amount ${
                isLaunchpadCreator ? 'you' : 'that the project'
              } would like to raise. The crowdfunding will stop upon reaching its hard cap`}
            >
              Hard Cap
            </InfoTooltip>
          </StatLabel>
          <StatNumber>
            <Flex gap={1} alignItems={'center'}>
              {Number(poolDetail?.thresholdBalance || 0) > 0 ? (
                <>
                  {formatCurrency(poolDetail?.thresholdBalance || 0)}{' '}
                  <img
                    src={
                      liquidityToken?.thumbnail ||
                      `${CDN_URL}/upload/1683530065704444020-1683530065-default-coin.svg`
                    }
                    alt={liquidityToken?.thumbnail || 'default-icon'}
                    className={'liquidity-token-avatar'}
                  />
                </>
              ) : (
                'N/A'
              )}
            </Flex>
          </StatNumber>
        </Stat>
        <Stat className={styles.infoColumn}>
          <StatLabel>
            <InfoTooltip
              showIcon
              label={`The initial price is the price that will be set at the start of the public sale.`}
            >
              Initial price
            </InfoTooltip>
          </StatLabel>
          <StatNumber>
            <InfoTooltip
              showIcon
              label={`The initial price—set at the start of the public sale—is ${formatCurrency(
                calcLaunchpadInitialPrice({
                  launchpadBalance: poolDetail?.launchpadBalance,
                  liquidityRatioArg: poolDetail?.liquidityRatioArg,
                  liquidityBalance: poolDetail?.liquidityBalance,
                }),
              )} times higher than the crowdfunding price.`}
            >
              <b>{`${formatCurrency(
                calcLaunchpadInitialPrice({
                  launchpadBalance: poolDetail?.launchpadBalance,
                  liquidityRatioArg: poolDetail?.liquidityRatioArg,
                  liquidityBalance: poolDetail?.liquidityBalance,
                }),
              )}x Crowdfunding price`}</b>
            </InfoTooltip>
          </StatNumber>
        </Stat>
        <Stat className={styles.infoColumn}>
          <StatLabel>Reward for Supporters</StatLabel>
          <StatNumber>{configs?.percentRewardForVoter}% funded</StatNumber>
        </Stat>
        <Stat className={styles.infoColumn}>
          <StatLabel>
            {[LAUNCHPAD_STATUS.Voting].includes(poolDetail?.state)
              ? 'Voting Ends in'
              : [LAUNCHPAD_STATUS.PrepareLaunching].includes(poolDetail?.state)
              ? 'Funding Starts in'
              : 'Voting Ended at'}
          </StatLabel>
          <StatNumber>
            {[LAUNCHPAD_STATUS.Voting].includes(poolDetail?.state) ? (
              <CountDownTimer end_time={poolDetail?.voteEnd} />
            ) : [LAUNCHPAD_STATUS.PrepareLaunching].includes(poolDetail?.state) ? (
              <CountDownTimer end_time={poolDetail?.launchStart} />
            ) : (
              moment(poolDetail?.voteEnd).format('LLL')
            )}
          </StatNumber>
        </Stat>
      </SimpleGrid>
    </Box>
  );
};

export default ProposalInfo;
