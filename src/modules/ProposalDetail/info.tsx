/* eslint-disable @typescript-eslint/no-explicit-any */
import {Box, Flex, GridItem, Progress, SimpleGrid, Stat, StatLabel, StatNumber, Text, Tooltip,} from '@chakra-ui/react';
import {abbreviateNumber, compareString, formatCurrency} from '@/utils';
import React, {useMemo} from 'react';
import {ILaunchpad} from '@/interfaces/launchpad';
import InfoTooltip from '@/components/Swap/infoTooltip';
import CountDownTimer from '@/components/Countdown';
import {useAppSelector} from '@/state/hooks';
import {selectPnftExchange} from '@/state/pnftExchange';
import {useWeb3React} from '@web3-react/core';
import {LAUNCHPAD_STATUS} from '@/modules/Launchpad/Launchpad.Status';
import moment from 'moment/moment';
import styles from "@/modules/LaunchPadDetail/form/styles.module.scss";
import {CDN_URL} from "@/configs";
import BigNumber from "bignumber.js";

const ProposalInfo = ({ poolDetail }: ILaunchpad | any) => {
  const configs = useAppSelector(selectPnftExchange).configs;
  const { account } = useWeb3React();
  const isLaunchpadCreator = compareString(poolDetail?.creatorAddress, account);
  const needReload = useAppSelector(selectPnftExchange).needReload;
  const liquidityToken = poolDetail?.liquidityToken;

  const percent = useMemo(() => {
    if (poolDetail?.id) {
      return new BigNumber(poolDetail?.totalValue)
        .div(poolDetail?.goalBalance)
        .multipliedBy(100)
        .toNumber();
    }

    return 0;
  }, [poolDetail?.id, needReload]);

  return (
    <Box color={'#FFFFFF'}>
      <Flex justifyContent={'space-between'}>
        <Stat className={styles.infoColumn}>
          <StatLabel>Funded</StatLabel>
          <StatNumber>
            <InfoTooltip
              label={`$${formatCurrency(poolDetail?.totalValueUsd || 0, 2)}`}
            >
              <Flex gap={1} alignItems={'center'}>
                <Flex gap={1} alignItems={'center'}>
                  {formatCurrency(poolDetail?.totalValue || 0)}{' '}
                  <img
                    src={
                      liquidityToken?.thumbnail ||
                      `${CDN_URL}/upload/1683530065704444020-1683530065-default-coin.svg`
                    }
                    alt={liquidityToken?.thumbnail || 'default-icon'}
                    className={'liquidity-token-avatar'}
                  />
                </Flex>
                <Text fontSize={'20px'} fontWeight={'400'}>
                  ({formatCurrency(percent, 2)}% funded)
                </Text>
              </Flex>
            </InfoTooltip>
          </StatNumber>
        </Stat>
        <Stat className={styles.infoColumn} textAlign={'left'}>
          <StatLabel>
            <Flex gap={1} justifyContent={'flex-end'}>
              <InfoTooltip
                showIcon={true}
                label={`The minimum amount ${
                  isLaunchpadCreator ? 'you' : 'that the project'
                } would like to raise. If the crowdfunding does not reach the Funding Goal, the funded amount will be returned to the contributors`}
              >
                {`Funding goal`}
              </InfoTooltip>
              /
              <InfoTooltip
                showIcon={true}
                label={`The maximum amount ${
                  isLaunchpadCreator ? 'you' : 'that the project'
                } would like to raise. The crowdfunding will stop upon reaching its hard cap`}
              >
                Hard Cap
              </InfoTooltip>
            </Flex>
          </StatLabel>
          <StatNumber>
            <Flex gap={1} justifyContent={'flex-end'}>
              <Flex gap={1} alignItems={'center'}>
                {formatCurrency(poolDetail?.goalBalance || 0)}
                <img
                  src={
                    liquidityToken?.thumbnail ||
                    `${CDN_URL}/upload/1683530065704444020-1683530065-default-coin.svg`
                  }
                  alt={liquidityToken?.thumbnail || 'default-icon'}
                  className={'liquidity-token-avatar'}
                />
              </Flex>
              /
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
            </Flex>
          </StatNumber>
        </Stat>
      </Flex>
      <Box className={styles.progressBar} mt={4}>
        <Progress
          w={['100%', '100%']}
          h="10px"
          value={percent}
          borderRadius={20}
        ></Progress>
        {/*<Image src={fireImg} className={styles.fireImg} />*/}
      </Box>
      <SimpleGrid columns={3} spacingX={6} mt={8}>
        <GridItem>
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
        </GridItem>
        <GridItem>
          <Stat className={styles.infoColumn}>
            <StatLabel>Reward for Supporters</StatLabel>
            <StatNumber>{configs?.percentRewardForVoter}% funded</StatNumber>
          </Stat>
        </GridItem>
        <GridItem>
          <Stat className={styles.infoColumn}>
            <StatLabel>
              {[LAUNCHPAD_STATUS.Voting].includes(poolDetail?.state)
                ? 'Voting Ends in'
                : 'Voting Ended at'}
            </StatLabel>
            <StatNumber>
              {[LAUNCHPAD_STATUS.Voting].includes(poolDetail?.state) ? (
                <CountDownTimer end_time={poolDetail?.voteEnd} />
              ) : (
                moment(poolDetail?.voteEnd).format('LLL')
              )}
            </StatNumber>
          </Stat>
        </GridItem>
      </SimpleGrid>
    </Box>
  );
};

export default ProposalInfo;
