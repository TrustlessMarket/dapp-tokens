/* eslint-disable @typescript-eslint/no-explicit-any */
import {Box, Divider, Grid, GridItem} from "@chakra-ui/react";
import BuyForm from "@/modules/LaunchPadDetail/form";
import Card from "@/components/Swap/card";
import React from "react";
import Intro from "@/modules/LaunchPadDetail/aboveTheFold/intro";
import Statistic from "@/modules/LaunchPadDetail/statistic";
import Usp from "@/modules/LaunchPadDetail/usp";
import {ILaunchpad} from "@/interfaces/launchpad";

const LaunchpadStarting = ({poolDetail}: { poolDetail: ILaunchpad }) => {
  return (
    <Box>
      <Grid templateColumns={['1.25fr 1fr']} gap={[8]}>
        <GridItem>
          <Intro poolDetail={poolDetail}/>
        </GridItem>
        <GridItem>
          <Card bgColor={"#1B1E26"} paddingX={6} paddingY={6}>
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
        <GridItem>
          <Card bgColor={"#1B1E26"} paddingX={6} paddingY={6} mt={8}>
            <Statistic poolDetail={poolDetail}/>
          </Card>
        </GridItem>
      </Grid>
    </Box>
  )
};

export default LaunchpadStarting;