/* eslint-disable @typescript-eslint/no-explicit-any */
import {Box, Flex, Grid, GridItem, Text} from "@chakra-ui/react";
import BuyForm from "@/modules/LaunchpadProposal/form";
import Card from "@/components/Swap/card";
import React from "react";
import Intro from "@/modules/LaunchPadDetail/aboveTheFold/intro";

const ProposalStarting = ({proposalDetail}: any) => {
  const poolDetail = proposalDetail?.userPool;
  return (
    <Box>
      <Flex justifyContent={"space-between"}>
        <Box>
         <Text>Nouns Mirai JAPAN</Text>
          <Text>Proposed by pnouns.⌐◨-◨at 0x932d4</Text>
        </Box>
        <Card bgColor={"transparent"} paddingX={6}>
          <BuyForm proposalDetail={proposalDetail}/>
        </Card>
      </Flex>
      <Grid templateColumns={['1fr']}>
        <GridItem>
          <Intro poolDetail={poolDetail}/>
        </GridItem>
        {/*<GridItem>
          <Card bgColor={"#2E2E2E"} paddingX={6} paddingY={6}>
            <BuyForm proposalDetail={proposalDetail}/>
          </Card>
        </GridItem>*/}
      </Grid>
    </Box>
  )
};

export default ProposalStarting;