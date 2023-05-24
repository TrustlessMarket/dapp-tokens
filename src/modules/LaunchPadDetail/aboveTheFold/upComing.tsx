/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from './styles.module.scss';
import {GridItem, SimpleGrid, Stat, StatLabel, StatNumber, Text} from "@chakra-ui/react";
import BodyContainer from "@/components/Swap/bodyContainer";
import {useLaunchPadStatus} from "@/modules/Launchpad/Launchpad.Status";
import {formatCurrency} from "@/utils";
import moment from "moment";
import Card from "@/components/Swap/card";
import React, {useEffect, useState} from "react";
import useCountDownTimer from "@/hooks/useCountdown";
import {useDispatch} from "react-redux";
import {requestReload} from "@/state/pnftExchange";

const LaunchpadUpComing = ({poolDetail}: any) => {
  const [status] = useLaunchPadStatus({ row: poolDetail });
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

  console.log('statusstatusstatus', status);

  return (
    <BodyContainer className={styles.wrapper}>
      <SimpleGrid className={"max-content"} columns={[1, 2]} spacingX={10}>
        <GridItem>
        </GridItem>
        <GridItem>
          <Card bgColor={"#1E1E22"} paddingX={8} paddingY={6}>
            <SimpleGrid columns={3} spacingX={6}>
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
                  <StatLabel>Launchpad Balance</StatLabel>
                  <StatNumber>{formatCurrency(poolDetail?.launchpadBalance)} {poolDetail?.launchpadToken?.symbol}</StatNumber>
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
            <Text mt={4} fontSize={"sm"} color={"#FFFFFF"}>All or nothing. This project will only be funded if it reaches its goal by {moment.utc(poolDetail?.endTime).format('ddd, MMMM Do YYYY HH:mm:ss Z')}.</Text>
          </Card>
        </GridItem>
      </SimpleGrid>
    </BodyContainer>
  )
};

export default LaunchpadUpComing;