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
  Text, Tooltip,
} from '@chakra-ui/react';
import moment from 'moment/moment';
import { FaFireAlt } from 'react-icons/fa';
import SocialToken from "@/components/Social";
import React from "react";

const AboveTheFold = ({ poolDetail, userBoost }: any) => {
  const launchpadToken: IToken = poolDetail?.launchpadToken;
  const [status] = useLaunchPadStatus({ row: poolDetail });

  return (
    <Box className={styles.wrapper}>
      <Flex
        pb={[3.5, 7]}
        mb={[7, 12]}
        borderBottom={'1px solid rgba(255, 255, 255, 0.1)'}
        justifyContent={['center', 'space-between']}
        flexDirection={['column', 'row']}
        gap={8}
        alignItems={'center'}
      >
        <Flex
          gap={4}
          color={'#FFFFFF'}
          alignItems={'center'}
          justifyContent={['center', 'flex-start']}
        >
          <Flex alignItems={'flex-start'} h={'100%'}>
            <img
              src={launchpadToken.thumbnail || TOKEN_ICON_DEFAULT}
              className={'launchpad-token-avatar'}
            />
          </Flex>
          <Flex gap={2} direction={"column"}>
            <Flex gap={1} fontSize={px2rem(24)} fontWeight={'500'}>
              {launchpadToken.name}{' '}
              <span style={{ color: 'rgba(255,255,255,0.7)' }}>
                {launchpadToken.symbol}
              </span>
              <VerifiedBadgeLaunchpad launchpad={poolDetail} />
            </Flex>
            <Flex alignItems={'center'} gap={2}>
              <Text className={styles.boxProposalId}>
                Launchpad #{formatCurrency(poolDetail.id, 0)}
              </Text>
              <LaunchpadStatus row={poolDetail} />
            </Flex>
            <SocialToken socials={poolDetail?.launchpadToken?.social} />
          </Flex>
        </Flex>
        {[LAUNCHPAD_STATUS.Pending].includes(poolDetail?.state) ? (
          <Text
            fontSize={px2rem(16)}
            fontWeight={'400'}
            color={'#FFFFFF'}
            bgColor={'rgba(255, 255, 255, 0.05)'}
            borderRadius={'8px'}
            px={6}
            py={2}
            maxW={px2rem(450)}
            textAlign={"center"}
            h={"fit-content"}
          >
            This project requires community votes to initiate crowdfunding. Please
            prepare your TM token to participate in the voting process.
          </Text>
        ) : [LAUNCHPAD_STATUS.Voting].includes(poolDetail?.state) ? (
          <Text
            fontSize={px2rem(16)}
            fontWeight={'400'}
            color={'#FFFFFF'}
            bgColor={'rgba(255, 255, 255, 0.05)'}
            borderRadius={'8px'}
            px={6}
            py={2}
            maxW={px2rem(450)}
            textAlign={"center"}
            h={"fit-content"}
          >
            If you enjoy this project, please show your support by voting for it.
          </Text>
        ) : [LAUNCHPAD_STATUS.Launching].includes(poolDetail?.state) ? (
          <Text
            fontSize={px2rem(16)}
            fontWeight={'400'}
            color={'#FFFFFF'}
            bgColor={'rgba(255, 255, 255, 0.05)'}
            borderRadius={'8px'}
            px={6}
            py={2}
            maxW={px2rem(450)}
            textAlign={"center"}
            h={"fit-content"}
          >
            All or nothing. This project will only be funded if it reaches its goal by{' '}
            <Text as={'span'} color={'#FF7E21'}>
              {moment
                .utc(poolDetail?.launchEnd)
                .format('ddd, MMMM Do YYYY HH:mm:ss Z')}
            </Text>
            .
          </Text>
        ) : (
          <></>
        )}
        <Flex
          alignItems={'center'}
          justifyContent={'center'}
          flexDirection={'column'}
        >
          <Stat>
            <StatLabel textAlign={['center', 'left']} fontSize={px2rem(24)}>
              {[LAUNCHPAD_STATUS.Pending].includes(poolDetail?.state)
                ? 'Voting will start in'
                : [LAUNCHPAD_STATUS.Launching].includes(poolDetail?.state)
                ? 'Ends in'
                : [
                    LAUNCHPAD_STATUS.Successful,
                    LAUNCHPAD_STATUS.Failed,
                    LAUNCHPAD_STATUS.PrepareToEndFunding,
                    LAUNCHPAD_STATUS.End,
                  ].includes(poolDetail?.state)
                ? 'Ended at'
                : ''}
            </StatLabel>
            <StatNumber>
              {[LAUNCHPAD_STATUS.Pending].includes(poolDetail?.state) ? (
                <Tooltip
                  label={`${moment(poolDetail.voteStart).format('LLL')}`}
                >
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
                </Tooltip>
              ) : [LAUNCHPAD_STATUS.Launching].includes(poolDetail?.state) ? (
                <Tooltip
                  label={`${moment(poolDetail.launchEnd).subtract("1", "h").format('LLL')}`}
                >
                  <Flex
                    mt={2}
                    alignItems={'center'}
                    gap={2}
                    className={styles.boxTime}
                  >
                    <FaFireAlt />
                    <Text>
                      <CountDownTimer end_time={moment(poolDetail.launchEnd).subtract("1", "h").toString()} />
                    </Text>
                  </Flex>
                </Tooltip>
              ) : [
                LAUNCHPAD_STATUS.Successful,
                LAUNCHPAD_STATUS.Failed,
                LAUNCHPAD_STATUS.PrepareToEndFunding,
                LAUNCHPAD_STATUS.End,
              ].includes(poolDetail?.state) ? (
                moment(poolDetail.launchEnd).subtract("1", "h").format('LLL')
              ) : (
                <></>
              )}
            </StatNumber>
          </Stat>
        </Flex>
      </Flex>
      <Grid className="top-grid">
        <GridItem area={'intro'}>
          <Intro poolDetail={poolDetail} />
        </GridItem>
        <GridItem area={'form'}>
          <Card
            bgColor={'#1B1E26'}
            paddingX={[3, 6]}
            paddingY={[3, 6]}
            minH={'50vh'}
          >
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
        <Grid className="bottom-grid" mt={6}>
          <GridItem area={'usp'}>
            <Box mt={[0, 8]}>
              <Usp />
            </Box>
          </GridItem>
          <GridItem area={'statics'}>
            <Card
              bgColor={'#1B1E26'}
              paddingX={[2, 6]}
              paddingY={[2, 6]}
              mt={[0, 8]}
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
