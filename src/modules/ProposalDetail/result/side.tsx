/* eslint-disable @typescript-eslint/no-explicit-any */

import {Box, Flex, Progress, Text} from "@chakra-ui/react";
import {compareString, formatCurrency, shortenAddress} from "@/utils";
import Jazzicon, {jsNumberForAddress} from 'react-jazzicon';
import React from "react";
import {useWindowSize} from "@trustless-computer/dapp-core";
import InfoTooltip from "@/components/Swap/infoTooltip";
import HorizontalItem from "@/components/Swap/horizontalItem";
import {TC_EXPLORER} from "@/configs";
import {useWeb3React} from "@web3-react/core";

const ProposalResult = ({title, totalVote, className, data}: any) => {
  const { mobileScreen, tabletScreen } = useWindowSize();
  const { account} = useWeb3React();
  return (
    <Box className={className}>
      <Flex justifyContent={"space-between"}>
        <Text className={"side-title"}>{title}</Text>
        <Text className={"side-total"} color={"#FFFFFF"}>Total number of Supporters: {formatCurrency(data?.totalVoter, 0)}</Text>
        <Text className={"side-total"} color={"#FFFFFF"}>Total TM Supported: {formatCurrency(data?.totalAmount, 0)}</Text>
      </Flex>
      <Progress
        max={100}
        value={(Number(data?.totalAmount) / totalVote) * 100}
        h="20px"
        className={"progress-bar"}
        mt={4}
      />
      <Flex mt={4} gap={4}>
        {
          data?.voters?.map((d: any) => {
            return (
              <InfoTooltip label={<Box>
                <HorizontalItem
                  label={<Text color={"rgba(255, 255, 255, 0.7)"}>Address</Text>}
                  value={<Text color={"#FFFFFF"}>{shortenAddress(d.voter, 4, 4)}</Text>}
                />
                <HorizontalItem
                  label={<Text color={"rgba(255, 255, 255, 0.7)"}>Amount</Text>}
                  value={<Text color={"#FFFFFF"}>{formatCurrency(d.amount)} {'TM'}</Text>}
                />
              </Box>
              }
                 key={d.voter}
              >
                <Box key={d.voter}>
                  <a
                    title="explorer"
                    href={`${TC_EXPLORER}/address/${d.voter}`}
                    target="_blank"
                    style={{ textDecoration: 'underline' }}
                  >
                    <Jazzicon
                      diameter={mobileScreen || tabletScreen ? 24 : 36}
                      seed={jsNumberForAddress(d.voter)}
                    />
                  </a>
                  {compareString(account, d.voter) && <Text color={"rgba(255, 255, 255, 0.7)"} textAlign={"center"} mt={-2}>You</Text>}
                </Box>
              </InfoTooltip>
            );
          })
        }
      </Flex>
    </Box>
  );
}

export default ProposalResult;