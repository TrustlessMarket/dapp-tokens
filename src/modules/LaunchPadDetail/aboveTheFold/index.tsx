/* eslint-disable @typescript-eslint/no-explicit-any */
import LaunchpadStatus, {LAUNCHPAD_STATUS} from '@/modules/Launchpad/Launchpad.Status';
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
import SectionContainer from "@/components/Swap/sectionContainer";

const AboveTheFold = ({ poolDetail }: ILaunchpad | any) => {
  const launchpadToken: IToken = poolDetail?.launchpadToken;

  return (
    <Box className={styles.wrapper}>
      <Flex mb={12} borderBottom={"1px solid rgba(255, 255, 255, 0.1)"}>
        <Flex gap={4} color={'#FFFFFF'} alignItems={'center'}>
          <Flex alignItems={'flex-start'} h={'100%'}>
            <img src={launchpadToken.thumbnail || TOKEN_ICON_DEFAULT} className={"token-avatar"}/>
          </Flex>
          <Box>
            <Text fontSize={px2rem(24)} fontWeight={'500'}>
              {launchpadToken.name} <span style={{color: 'rgba(255,255,255,0.7)'}}>{launchpadToken.symbol}</span>
            </Text>
            <Flex alignItems={"center"} mt={2} gap={2}>
              <Text className={styles.boxProposalId}>Launchpad #{formatCurrency(poolDetail.id, 0)}</Text>
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
      {
        [
          LAUNCHPAD_STATUS.Draft,
          LAUNCHPAD_STATUS.Pending,
          LAUNCHPAD_STATUS.NotPassed
        ] ? (
          <Grid templateColumns={['1fr']} gap={[8]} mt={6} bgColor={"#1E1E22"} py={8} ml={-px2rem(25)} mr={-px2rem(25)}>
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
              <Card bgColor={"#1B1E26"} paddingX={6} paddingY={6} mt={8} borderRadius={"12px"}>
                <Statistic poolDetail={poolDetail}/>
              </Card>
            </GridItem>
          </Grid>
        )
      }
    </Box>
  );
};

export default AboveTheFold;
