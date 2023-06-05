/* eslint-disable @typescript-eslint/no-explicit-any */
import LaunchpadStatus, {LAUNCHPAD_STATUS, useLaunchPadStatus} from '@/modules/Launchpad/Launchpad.Status';
import styles from '@/modules/LaunchPadDetail/aboveTheFold/styles.module.scss';
import {ILaunchpad} from '@/interfaces/launchpad';
import {Box, Flex, Grid, GridItem, Text} from "@chakra-ui/react";
import Intro from "@/modules/LaunchPadDetail/aboveTheFold/intro";
import Card from "@/components/Swap/card";
import BuyForm from "@/modules/LaunchPadDetail/form";
import Usp from "@/modules/LaunchPadDetail/usp";
import Statistic from "@/modules/LaunchPadDetail/statistic";
import React from "react";
import {TOKEN_ICON_DEFAULT} from "@/constants/common";
import px2rem from "@/utils/px2rem";
import {formatCurrency} from "@/utils";
import {IToken} from "@/interfaces/token";

const AboveTheFold = ({ poolDetail }: ILaunchpad | any) => {
  const [status] = useLaunchPadStatus({ row: poolDetail });
  const launchpadToken: IToken = poolDetail?.launchpadToken;

  return (
    <Box className={styles.wrapper}>
      <Flex justifyContent={'center'} mb={12}>
        <Flex gap={4} color={'#FFFFFF'} alignItems={'center'}>
          <Flex alignItems={'flex-start'} h={'100%'}>
            <img src={launchpadToken.thumbnail || TOKEN_ICON_DEFAULT} className={"token-avatar"}/>
          </Flex>
          <Box>
            <Text fontSize={px2rem(24)} fontWeight={'500'}>
              {launchpadToken.name} <span>{launchpadToken.symbol}</span>
            </Text>
            <Flex alignItems={"center"} mt={2} gap={2}>
              <Text className={styles.boxProposalId}>Launchpad {formatCurrency(poolDetail.id, 0)}</Text>
              <LaunchpadStatus row={poolDetail} />
            </Flex>
          </Box>
        </Flex>
      </Flex>
      <Grid templateColumns={['1.25fr 1fr']} gap={[8]}>
        <GridItem>
          <Intro poolDetail={poolDetail}/>
        </GridItem>
        <GridItem>
          <Card bgColor={"#1B1E26"} paddingX={6} paddingY={6} minH={"50vh"}>
            <BuyForm poolDetail={poolDetail}/>
          </Card>
        </GridItem>
      </Grid>
      <Grid templateColumns={['1.25fr 1fr']} gap={[8]} mt={6}>
        <GridItem>
          <Box mt={8}>
            <Usp />
          </Box>
        </GridItem>
        {
          ![
            LAUNCHPAD_STATUS.Draft,
            LAUNCHPAD_STATUS.Pending,
            LAUNCHPAD_STATUS.Voting,
            LAUNCHPAD_STATUS.NotPassed
          ].includes(status.key) && (
            <GridItem>
              <Card bgColor={"#1B1E26"} paddingX={6} paddingY={6} mt={8}>
                <Statistic poolDetail={poolDetail}/>
              </Card>
            </GridItem>
          )
        }
      </Grid>
    </Box>
  );
};

export default AboveTheFold;
