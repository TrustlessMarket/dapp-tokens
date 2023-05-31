/* eslint-disable @typescript-eslint/no-explicit-any */
import {Box, Flex, Grid, GridItem, Text} from "@chakra-ui/react";
import BuyForm from "@/modules/ProposalDetail/form";
import Card from "@/components/Swap/card";
import React from "react";
import Intro from "@/modules/LaunchPadDetail/aboveTheFold/intro";
import {TC_EXPLORER} from "@/configs";
import {formatLongAddress} from "@/utils";

const ProposalStarting = ({proposalDetail}: any) => {
  const poolDetail = proposalDetail?.userPool;
  return (
    <Box>
      <Flex justifyContent={"space-between"} mb={6}>
        <Flex alignItems={"center"} gap={1}>
          <Text>Proposed by</Text>
          <a
            title="explorer"
            href={`${TC_EXPLORER}/tx/${proposalDetail?.proposerAddress}`}
            target="_blank"
            style={{ textDecoration: 'underline' }}
          >
            {formatLongAddress(proposalDetail?.proposerAddress)}
          </a>
          at
          <a
            title="explorer"
            href={`${TC_EXPLORER}/tx/${proposalDetail?.txHash}`}
            target="_blank"
            style={{ textDecoration: 'underline' }}
          >
            {formatLongAddress(proposalDetail?.txHash)}
          </a>
        </Flex>
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