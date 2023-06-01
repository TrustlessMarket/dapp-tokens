/* eslint-disable @typescript-eslint/no-explicit-any */
import {Box, Flex, Text} from "@chakra-ui/react";
import BuyForm from "@/modules/ProposalDetail/form";
import Card from "@/components/Swap/card";
import React from "react";
import {TC_EXPLORER} from "@/configs";
import {formatLongAddress} from "@/utils";

const ProposalStarting = ({proposalDetail}: any) => {
  return (
    <Box>
      <Flex justifyContent={"space-between"} mb={6}>
        <Flex alignItems={"center"} gap={1}>
          <Text>Proposed by</Text>
          <a
            title="explorer"
            href={`${TC_EXPLORER}/address/${proposalDetail?.proposerAddress}`}
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
    </Box>
  )
};

export default ProposalStarting;