/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from './styles.module.scss';
import {Box, GridItem, SimpleGrid, Stat, StatLabel, StatNumber, Text} from "@chakra-ui/react";
import Card from "@/components/Swap/card";
import React, {useEffect, useState} from "react";
import {formatCurrency} from "@/utils";
import useCountDownTimer from "@/hooks/useCountdown";
import moment from "moment/moment";
import {useDispatch} from "react-redux";
import {requestReload} from "@/state/pnftExchange";
import AllowlistTable from "@/modules/LaunchPadDetail/statistic/AllowlistTable";

const Statistic = ({poolDetail} : any) => {
  const [endTime, setEndTime] = useState(0);
  const [days, hours, minutes, seconds, expired] = useCountDownTimer(
    moment.unix(endTime).format("YYYY/MM/DD HH:mm:ss")
  );

  useEffect(() => {
    if(poolDetail?.id) {
      setEndTime(moment(poolDetail?.endTime).unix());
    }
  }, [poolDetail?.id])

  const dispatch = useDispatch();

  useEffect(() => {
    if (expired && endTime) {
      dispatch(requestReload());
    }
  }, [expired]);

  return (
    <Box className={styles.wrapper}>
      <Card bgColor={"#1E1E22"} paddingX={8} paddingY={6}>
        <SimpleGrid columns={3} spacingX={6}>
          <GridItem>
            <Stat>
              <StatLabel>Funded</StatLabel>
              <StatNumber>
                ${formatCurrency(poolDetail?.totalValueUsd || 0,2)}
              </StatNumber>
            </Stat>
          </GridItem>
          <GridItem>
            <Stat>
              <StatLabel>Backers</StatLabel>
              <StatNumber>
                {formatCurrency(poolDetail?.contributors || 0, 0)}
              </StatNumber>
            </Stat>
          </GridItem>
          <GridItem>
            <Stat>
              <StatLabel>Ends in</StatLabel>
              <StatNumber>
                <Text>{Number(days) > 0 && `${days}d :`} {hours}h : {minutes}m : {seconds}s</Text>
              </StatNumber>
            </Stat>
          </GridItem>
        </SimpleGrid>
        <Text mt={4} fontSize={"sm"} color={"#FFFFFF"}>All or nothing. This project will only be funded if it reaches its goal by {moment.utc(poolDetail?.endTime).format('ddd, MMMM Do YYYY HH:mm:ss Z')}.</Text>
      </Card>
      <Card bgColor={"#1E1E22"} paddingX={8} paddingY={6} mt={6}>
        <AllowlistTable poolDetail={poolDetail}/>
      </Card>
    </Box>
  )
};

export default Statistic;