/* eslint-disable @typescript-eslint/no-explicit-any */

import {Box, Flex, Progress, Text} from "@chakra-ui/react";
import {formatCurrency} from "@/utils";
import Jazzicon, {jsNumberForAddress} from 'react-jazzicon';
import React from "react";
import {useWindowSize} from "@trustless-computer/dapp-core";
import InfoTooltip from "@/components/Swap/infoTooltip";
import HorizontalItem from "@/components/Swap/horizontalItem";

const ProposalResult = ({title, result, className, data}: any) => {
  const { mobileScreen, tabletScreen } = useWindowSize();
  console.log('title, result', title, result, className, data);
  return (
    <Box className={className}>
      <Flex justifyContent={"space-between"}>
        <Text>{title}</Text>
        <Text>{formatCurrency(data?.totalVoter, 0)}</Text>
      </Flex>
      <Progress
        max={100}
        value={0.5 * 100}
        size="xs"
        mt={4}
      />
      <Flex mt={4}>
        {
          data?.voters?.map((d: any) => {
            return (
              <InfoTooltip label={<Box>
                <HorizontalItem
                  label="Address"
                  value={d.voter}
                />
                <HorizontalItem
                  label="Weight"
                  value={formatCurrency(d.weight)}
                />
              </Box>}
                 key={d.voter}
              >
                <Box flex={1} maxW={"25%"} key={d.voter}>
                  <Jazzicon
                    diameter={mobileScreen || tabletScreen ? 24 : 36}
                    seed={jsNumberForAddress(d.voter)}
                  />
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