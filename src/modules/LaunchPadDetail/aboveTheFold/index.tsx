/* eslint-disable @typescript-eslint/no-explicit-any */
import CountDownTimer from '@/components/Countdown';
import Card from '@/components/Swap/card';
import SectionContainer from '@/components/Swap/sectionContainer';
import { TOKEN_ICON_DEFAULT } from '@/constants/common';
import { IToken } from '@/interfaces/token';
import styles from '@/modules/LaunchPadDetail/aboveTheFold/styles.module.scss';
import BuyForm from '@/modules/LaunchPadDetail/form';
import Intro from '@/modules/LaunchPadDetail/intro';
import Statistic from '@/modules/LaunchPadDetail/statistic';
import Usp from '@/modules/LaunchPadDetail/usp';
import LaunchpadStatus, {
  LAUNCHPAD_STATUS,
  useLaunchPadStatus,
} from '@/modules/Launchpad/Launchpad.Status';
import VerifiedBadgeLaunchpad from '@/modules/Launchpad/verifiedBadgeLaunchpad';
import { formatCurrency } from '@/utils';
import px2rem from '@/utils/px2rem';
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  Text,
} from '@chakra-ui/react';
import moment from 'moment/moment';
import { FaFireAlt } from 'react-icons/fa';

const AboveTheFold = ({ poolDetail, userBoost }: any) => {
  const launchpadToken: IToken = poolDetail?.launchpadToken;
  const [status] = useLaunchPadStatus({ row: poolDetail });

  return (
    <Box className={styles.wrapper}>
      <Flex
        pb={7}
        mb={12}
        borderBottom={'1px solid rgba(255, 255, 255, 0.1)'}
        justifyContent={'space-between'}
      >
        <Flex gap={4} color={'#FFFFFF'} alignItems={'center'}>
          <Flex alignItems={'flex-start'} h={'100%'}>
            <img
              src={launchpadToken.thumbnail || TOKEN_ICON_DEFAULT}
              className={'launchpad-token-avatar'}
            />
          </Flex>
          <Box>
            <Flex gap={1} fontSize={px2rem(24)} fontWeight={'500'}>
              {launchpadToken.name}{' '}
              <span style={{ color: 'rgba(255,255,255,0.7)' }}>
                {launchpadToken.symbol}
              </span>
              <VerifiedBadgeLaunchpad launchpad={poolDetail} />
            </Flex>
            <Flex alignItems={'center'} mt={2} gap={2}>
              <Text className={styles.boxProposalId}>
                Launchpad #{formatCurrency(poolDetail.id, 0)}
              </Text>
              <LaunchpadStatus row={poolDetail} />
            </Flex>
          </Box>
        </Flex>
        <Flex>
          <Stat>
            <StatLabel fontSize={px2rem(24)}>
              {[LAUNCHPAD_STATUS.Pending].includes(poolDetail?.state)
                ? 'Voting will start in'
                : [LAUNCHPAD_STATUS.Launching].includes(poolDetail?.state)
                ? 'Ends in'
                : [
                    LAUNCHPAD_STATUS.Successful,
                    LAUNCHPAD_STATUS.Failed,
                    LAUNCHPAD_STATUS.End,
                  ].includes(poolDetail?.state)
                ? 'Ended at'
                : ''}
            </StatLabel>
            <StatNumber>
              <Text>
                {[LAUNCHPAD_STATUS.Pending].includes(poolDetail?.state) ? (
                  <Flex
                    mt={2}
                    alignItems={'center'}
                    gap={2}
                    className={styles.boxTime}
                  >
                    <FaFireAlt />
                    <Text>
                      <CountDownTimer end_time={poolDetail.voteStart} />
                    </Text>
                  </Flex>
                ) : [LAUNCHPAD_STATUS.Launching].includes(poolDetail?.state) ? (
                  <Flex
                    mt={2}
                    alignItems={'center'}
                    gap={2}
                    className={styles.boxTime}
                  >
                    <FaFireAlt />
                    <Text>
                      <CountDownTimer end_time={poolDetail.launchEnd} />
                    </Text>
                  </Flex>
                ) : [
                    LAUNCHPAD_STATUS.Successful,
                    LAUNCHPAD_STATUS.Failed,
                    LAUNCHPAD_STATUS.End,
                  ].includes(poolDetail?.state) ? (
                  moment(poolDetail.launchEnd).format('LLL')
                ) : (
                  <></>
                )}
              </Text>
            </StatNumber>
          </Stat>
        </Flex>
      </Flex>
      <Grid templateColumns={['1.25fr 1fr']} gap={[8]}>
        <GridItem>
          <Intro poolDetail={poolDetail} />
        </GridItem>
        <GridItem>
          <Card bgColor={'#1B1E26'} paddingX={6} paddingY={6} minH={'50vh'}>
            <BuyForm poolDetail={poolDetail} />
          </Card>
        </GridItem>
      </Grid>
      {[LAUNCHPAD_STATUS.Draft, LAUNCHPAD_STATUS.Pending].includes(status?.key) ? (
        <Grid
          templateColumns={['1fr']}
          gap={[8]}
          mt={6}
          bgColor={'#1E1E22'}
          py={8}
          ml={-px2rem(25)}
          mr={-px2rem(25)}
        >
          <SectionContainer>
            <Usp />
          </SectionContainer>
        </Grid>
      ) : (
        <Grid templateColumns={['1.25fr 1fr']} gap={[8]} mt={6}>
          <GridItem>
            <Box mt={8}>
              <Usp />
            </Box>
          </GridItem>
          <GridItem>
            <Card
              bgColor={'#1B1E26'}
              paddingX={6}
              paddingY={6}
              mt={8}
              borderRadius={'12px'}
            >
              <Statistic poolDetail={poolDetail} userBoost={userBoost} />
            </Card>
          </GridItem>
        </Grid>
      )}
    </Box>
  );
};

export default AboveTheFold;
