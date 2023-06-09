/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {Box, Flex} from "@chakra-ui/react";
import {ILaunchpad} from "@/interfaces/launchpad";
import InfoTooltip from "@/components/Swap/infoTooltip";
import {CDN_URL} from "@/configs";

const VerifiedBadgeLaunchpad: React.FC<any> = ({launchpad} : {launchpad: ILaunchpad}): React.ReactElement => {
  return launchpad?.warningNote ? (
      <InfoTooltip
        label={
          <Box
            fontWeight={"400"}
            dangerouslySetInnerHTML={{ __html: launchpad?.warningNote }}
          />
        }
      >
        <Flex
          // bgColor={"brand.danger.50"}
          color={"brand.danger.400"}
          gap={1}
          alignItems={"center"}
          // paddingX={2}
          // paddingY={0}
          borderRadius={"8px"}
          fontSize={"xs"}
          fontWeight={"medium"}
        >
          {/*<Text textTransform={"capitalize"}>{"warning"}</Text>*/}
          {/*<Icon as={ImWarning} fontSize={"12px"}/>*/}
          <img
            src={`${CDN_URL}/icons/warning.svg`}
            alt="New Bitcoin DEX logo"
            style={{width: '18px', height: '18px'}}
          />
        </Flex>
      </InfoTooltip>

  ) : <div/>;
};

export default VerifiedBadgeLaunchpad;