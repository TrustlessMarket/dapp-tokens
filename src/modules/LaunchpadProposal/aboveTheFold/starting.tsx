/* eslint-disable @typescript-eslint/no-explicit-any */
import {Box, Grid, GridItem} from "@chakra-ui/react";
import BuyForm from "@/modules/LaunchpadProposal/form";
import Card from "@/components/Swap/card";
import React from "react";
import Intro from "@/modules/LaunchPadDetail/aboveTheFold/intro";

const ProposalStarting = ({proposalDetail}: any) => {
  const poolDetail = proposalDetail?.userPool;
  return (
    <Box>
      <Grid templateColumns={['1.25fr 1fr']} gap={[8]}>
        <GridItem>
          <Intro poolDetail={poolDetail}/>
        </GridItem>
        <GridItem>
          <Card bgColor={"#2E2E2E"} paddingX={6} paddingY={6}>
            <BuyForm proposalDetail={proposalDetail}/>
          </Card>
        </GridItem>
      </Grid>
    </Box>
  )
};

export default ProposalStarting;