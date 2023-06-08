/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {Flex, Icon, Text} from "@chakra-ui/react";
import {ImWarning} from "react-icons/im";
import {IToken} from '@/interfaces/token';
import {ILaunchpad} from "@/interfaces/launchpad";
import InfoTooltip from "@/components/Swap/infoTooltip";

const VerifiedBadgeLaunchpad: React.FC<any> = ({launchpad} : {launchpad: ILaunchpad}): React.ReactElement => {
  const token: IToken = launchpad.launchpadToken;
  const missing = [];

  if(!token?.social?.website) {
    missing.push('website');
  }

  if(!token?.social?.discord) {
    missing.push('Discord server');
  }

  if(!token?.social?.twitter) {
    missing.push('Twitter account');
  }

  if(!token?.thumbnail) {
    missing.push('token icon');
  }

  const message = `Please note that this projects does not currently have a ${missing.join(', ')} — kindly proceed with caution.`;

  return missing?.length > 0 ? (
      <InfoTooltip
        label={message}
      >
        <Flex
          bgColor={"brand.danger.50"}
          color={"brand.danger.400"}
          gap={1}
          alignItems={"center"}
          paddingX={2}
          paddingY={0}
          borderRadius={"8px"}
          fontSize={"xs"}
          fontWeight={"medium"}
        >
          <Text textTransform={"capitalize"}>{"warning"}</Text>
          <Icon as={ImWarning} fontSize={"12px"}/>
        </Flex>
      </InfoTooltip>

  ) : <div/>;
};

export default VerifiedBadgeLaunchpad;