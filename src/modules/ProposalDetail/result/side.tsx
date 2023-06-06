/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */

import {Box, Flex, Progress, SimpleGrid, Text} from "@chakra-ui/react";
import {compareString, formatCurrency, shortenAddress} from "@/utils";
import Jazzicon, {jsNumberForAddress} from 'react-jazzicon';
import React, {useMemo} from "react";
import {useWindowSize} from "@trustless-computer/dapp-core";
import InfoTooltip from "@/components/Swap/infoTooltip";
import HorizontalItem from "@/components/Swap/horizontalItem";
import {TC_EXPLORER} from "@/configs";
import {useWeb3React} from "@web3-react/core";

const ProposalResult = ({title, totalVote, className, data}: any) => {
  const { mobileScreen, tabletScreen } = useWindowSize();
  const { account} = useWeb3React();

  const emtyData = useMemo(() => {
    return [...Array(18 - (data?.voters?.length || 0))].map(function () {});
  }, [JSON.stringify(data)]);

  return (
    <Box className={className}>
      <Flex justifyContent={"space-between"}>
        <Text className={"side-title"}>{title}</Text>
        <Text className={"side-total"} color={"#FFFFFF"}>Total number of Supporters: {formatCurrency(data?.totalVoter, 0)}</Text>
        <Text className={"side-total"} color={"#FFFFFF"}>Total TM Supported: {formatCurrency(data?.totalAmount, 0)} / {totalVote}</Text>
      </Flex>
      <Progress
        max={100}
        value={(Number(data?.totalAmount) / totalVote) * 100}
        h="20px"
        className={"progress-bar"}
        mt={4}
      />
      <SimpleGrid mt={6} spacingX={8} spacingY={4} columns={6} w={"fit-content"} marginX={"auto"}>
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
                      diameter={mobileScreen || tabletScreen ? 40 : 60}
                      seed={jsNumberForAddress(d.voter)}
                    />
                  </a>
                  {compareString(account, d.voter) && <Text color={"rgba(255, 255, 255, 0.7)"} textAlign={"center"} mt={-2}>You</Text>}
                </Box>
              </InfoTooltip>
            );
          })
        }
        {
          emtyData?.map((d: any, index) => {
            return (
              <Box
                key={index}
                width={`${mobileScreen || tabletScreen ? 40 : 60}px`}
                height={`${mobileScreen || tabletScreen ? 40 : 60}px`}
                borderRadius={"50%"}
                backgroundColor={"#1E1E22"}
              >
              </Box>
            )
          })
        }
      </SimpleGrid>
    </Box>
  );
}

export default ProposalResult;