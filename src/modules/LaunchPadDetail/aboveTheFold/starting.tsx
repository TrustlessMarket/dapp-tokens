/* eslint-disable @typescript-eslint/no-explicit-any */
import {Box, Grid, GridItem} from "@chakra-ui/react";
import BuyForm from "@/modules/LaunchPadDetail/form";
import Card from "@/components/Swap/card";
import AllowlistTable from "@/modules/LaunchPadDetail/statistic/AllowlistTable";
import React from "react";
import Intro from "@/modules/LaunchPadDetail/aboveTheFold/intro";

const LaunchpadStarting = ({poolDetail}: any) => {
  return (
    <Box className={"max-content"}>
      <Grid templateColumns={['1.75fr 1fr']} gap={[8]}>
        <GridItem>
          <Intro poolDetail={poolDetail}/>
        </GridItem>
        <GridItem>
          <Card bgColor={"#1E1E22"} paddingX={8} paddingY={6}>
            <BuyForm poolDetail={poolDetail}/>
          </Card>
          <Card bgColor={"#1E1E22"} paddingX={8} paddingY={6} mt={8}>
            <AllowlistTable poolDetail={poolDetail}/>
          </Card>
        </GridItem>
      </Grid>
    </Box>
  )
};

export default LaunchpadStarting;