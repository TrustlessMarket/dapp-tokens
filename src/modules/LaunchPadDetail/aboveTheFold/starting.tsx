/* eslint-disable @typescript-eslint/no-explicit-any */
import {Box, Grid, GridItem} from "@chakra-ui/react";
import BuyForm from "@/modules/LaunchPadDetail/form";
import Card from "@/components/Swap/card";
import React from "react";
import Intro from "@/modules/LaunchPadDetail/aboveTheFold/intro";
import Statistic from "@/modules/LaunchPadDetail/statistic";

const LaunchpadStarting = ({poolDetail}: any) => {
  return (
    <Box>
      <Grid templateColumns={['1.75fr 1fr']} gap={[8]}>
        <GridItem>
          <Intro poolDetail={poolDetail}/>
        </GridItem>
        <GridItem>
          <Card bgColor={"#1E1E22"} paddingX={6} paddingY={6}>
            <BuyForm poolDetail={poolDetail}/>
          </Card>
          <Card bgColor={"#1E1E22"} paddingX={6} paddingY={6} mt={8}>
            <Statistic poolDetail={poolDetail}/>
          </Card>
        </GridItem>
      </Grid>
    </Box>
  )
};

export default LaunchpadStarting;