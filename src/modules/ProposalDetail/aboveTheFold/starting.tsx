/* eslint-disable @typescript-eslint/no-explicit-any */
import {Box, Flex, Text} from "@chakra-ui/react";
import BuyForm from "@/modules/ProposalDetail/form";
import Card from "@/components/Swap/card";
import React from "react";
import {IToken} from "@/interfaces/token";
import {TOKEN_ICON_DEFAULT} from "@/constants/common";
import px2rem from "@/utils/px2rem";
import styles from './styles.module.scss';
import {formatCurrency} from "@/utils";
import ProposalStatus from "@/modules/Proposal/Proposal.Status";

const ProposalStarting = ({proposalDetail}: any) => {
  const token: IToken = proposalDetail?.userPool?.launchpadToken;

  return (
    <Box border={"1px solid #353945"} paddingX={6} paddingY={6}>
      <Flex justifyContent={"space-between"} mb={6}>
        <Flex gap={4} color={'#FFFFFF'} alignItems={'center'}>
          <img src={token.thumbnail || TOKEN_ICON_DEFAULT} />
          <Box>
            <Text fontSize={px2rem(24)} fontWeight={"500"}>
              {token.name} <span>{token.symbol}</span>
            </Text>
            <Flex alignItems={"center"} mt={2} gap={2}>
              <Text className={styles.boxProposalId}>Proposal {formatCurrency(proposalDetail.id, 0)}</Text>
              <ProposalStatus row={proposalDetail} />
            </Flex>
          </Box>
        </Flex>
        {/*<Flex alignItems={"center"} gap={1}>
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
        </Flex>*/}
        <Card bgColor={"transparent"} paddingX={6}>
          <BuyForm proposalDetail={proposalDetail}/>
        </Card>
      </Flex>
    </Box>
  )
};

export default ProposalStarting;