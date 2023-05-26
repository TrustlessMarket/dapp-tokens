/* eslint-disable @typescript-eslint/no-explicit-any */
import {Box, Flex, Grid, GridItem, SimpleGrid, Stat, StatLabel, StatNumber, Text} from "@chakra-ui/react";
import {formatCurrency} from "@/utils";
import moment from "moment";
import Card from "@/components/Swap/card";
import React, {useEffect, useState} from "react";
import useCountDownTimer from "@/hooks/useCountdown";
import {useDispatch} from "react-redux";
import {requestReload} from "@/state/pnftExchange";
import Intro from "@/modules/LaunchPadDetail/aboveTheFold/intro";
import SocialToken from "@/components/Social";

const LaunchpadUpComing = ({poolDetail}: any) => {
  const [endTime, setEndTime] = useState(0);
  const [days, hours, minutes, seconds, expired] = useCountDownTimer(
    moment.unix(endTime).format("YYYY/MM/DD HH:mm:ss")
  );

  useEffect(() => {
    if(poolDetail?.id) {
      setEndTime(moment(poolDetail?.startTime).unix());
    }
  }, [poolDetail?.id])

  const dispatch = useDispatch();

  useEffect(() => {
    if (expired && endTime) {
      dispatch(requestReload());
    }
  }, [expired]);

  return (
    <Box className={"max-content"}>
      <Grid templateColumns={['1.75fr 1fr']} gap={[8]}>
        <GridItem>
          <Intro poolDetail={poolDetail}/>
        </GridItem>
        <GridItem>
          <Card bgColor={"#1E1E22"} paddingX={8} paddingY={6} minH={"400px"}>
            <SimpleGrid columns={1} spacingX={6}>
              <GridItem>
                <Stat>
                  <StatLabel>Rewards</StatLabel>
                  <StatNumber>{formatCurrency(poolDetail?.launchpadBalance)} {poolDetail?.launchpadToken?.symbol}</StatNumber>
                </Stat>
              </GridItem>
              <GridItem>
                <Stat>
                  <StatLabel>Goal</StatLabel>
                  <StatNumber>
                    {formatCurrency(poolDetail?.goalBalance || 0)} {poolDetail?.liquidityToken?.symbol}
                  </StatNumber>
                </Stat>
              </GridItem>
              <GridItem>
                <Stat>
                  <StatLabel>Starts in</StatLabel>
                  <StatNumber>
                    <Text>{Number(days) > 0 && `${days}d :`} {hours}h : {minutes}m : {seconds}s</Text>
                  </StatNumber>
                </Stat>
              </GridItem>
            </SimpleGrid>
            <Flex justifyContent={"flex-start"}>
              <SocialToken socials={poolDetail?.launchpadToken?.social} />
            </Flex>
            <Text mt={4} fontSize={"sm"} color={"#FFFFFF"}>All or nothing. This project will only be funded if it reaches its goal by {moment.utc(poolDetail?.endTime).format('ddd, MMMM Do YYYY HH:mm:ss Z')}.</Text>
          </Card>
        </GridItem>
      </Grid>
    </Box>
  )
};

export default LaunchpadUpComing;