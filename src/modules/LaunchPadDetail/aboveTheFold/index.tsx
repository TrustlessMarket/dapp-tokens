/* eslint-disable @typescript-eslint/no-explicit-any */
import {LAUNCHPAD_STATUS, useLaunchPadStatus} from '@/modules/Launchpad/Launchpad.Status';
import styles from '@/modules/LaunchPadDetail/aboveTheFold/styles.module.scss';
import {ILaunchpad} from '@/interfaces/launchpad';
import {Box, Divider, Grid, GridItem} from "@chakra-ui/react";
import Intro from "@/modules/LaunchPadDetail/aboveTheFold/intro";
import Card from "@/components/Swap/card";
import BuyForm from "@/modules/LaunchPadDetail/form";
import Usp from "@/modules/LaunchPadDetail/usp";
import Statistic from "@/modules/LaunchPadDetail/statistic";
import React from "react";

const AboveTheFold = ({ poolDetail }: ILaunchpad | any) => {
  const [status] = useLaunchPadStatus({ row: poolDetail });

  return (
    <Box className={styles.wrapper}>
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
      <Grid templateColumns={['1.25fr 1fr']} gap={[8]}>
        <GridItem>
          <Box mt={10}/>
          <Divider color={"#353945"}/>
          <Box mt={10}/>
          <Usp />
        </GridItem>
        {
          ![LAUNCHPAD_STATUS.Pending].includes(status.key) && (
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
