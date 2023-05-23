import styles from './styles.module.scss';
import {Box, GridItem, SimpleGrid, Stat, StatLabel, StatNumber, Text} from "@chakra-ui/react";
import Card from "@/components/Swap/card";
import React, {useEffect} from "react";
import {formatCurrency} from "@/utils";
import useCountDownTimer from "@/hooks/useCountdown";
import moment from "moment/moment";
import {useDispatch} from "react-redux";
import {requestReload, updateShowBanner} from "@/state/pnftExchange";
import AllowlistTable from "@/modules/IdoDetail/statistic/AllowlistTable";

const END_TIME = 1685432779;

const Statistic = () => {
  const [days, hours, minutes, seconds, expired] = useCountDownTimer(
    moment.unix(END_TIME).format("YYYY/MM/DD HH:mm:ss")
  );

  console.log('days, hours, minutes, seconds, expired', days, hours, minutes, seconds, expired);

  const dispatch = useDispatch();

  useEffect(() => {
    if (expired && END_TIME) {
      dispatch(requestReload());
      dispatch(updateShowBanner(false));
    }
  }, [expired]);

  return (
    <Box className={styles.wrapper}>
      <Card bgColor={"#1E1E22"} paddingX={8} paddingY={6}>
        <SimpleGrid columns={3} spacingX={6}>
          <GridItem>
            <Stat>
              <StatLabel>Total</StatLabel>
              <StatNumber>
                ${formatCurrency(12345678,901234)}
              </StatNumber>
            </Stat>
          </GridItem>
          <GridItem>
            <Stat>
              <StatLabel>Contributors</StatLabel>
              <StatNumber>
                {formatCurrency(1234, 0)}
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
      </Card>
      <AllowlistTable />
    </Box>
  )
};

export default Statistic;