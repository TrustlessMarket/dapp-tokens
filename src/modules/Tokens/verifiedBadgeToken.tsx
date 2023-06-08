/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {Flex, Icon} from "@chakra-ui/react";
import {HiBadgeCheck} from "react-icons/hi";
import {IToken} from '@/interfaces/token';
import {CDN_URL} from "@/configs";

export const VERIFIED_STATUS = {
  WARNING: 'warning',
  CAUTION: 'caution',
  PREMIUM: 'premium',
  NORMAL: ''
}

export const getTextColorStatus = (status?: string) => {
  if(status === VERIFIED_STATUS.WARNING) {
    return "brand.danger.400";
  } else if (status === VERIFIED_STATUS.CAUTION) {
    return "brand.warning.400";
  } else if (status === VERIFIED_STATUS.PREMIUM) {
    return "brand.success.400";
  } else {
    return "#FFFFFF";
  }
}

export const getBgColorStatus = (status: string) => {
  if(status === VERIFIED_STATUS.WARNING) {
    return "brand.danger.50";
  } else if (status === VERIFIED_STATUS.CAUTION) {
    return "brand.warning.50";
  } else if (status === VERIFIED_STATUS.PREMIUM) {
    return "brand.success.50";
  } else {
    return "#FFFFFF";
  }
}

const VerifiedBadge: React.FC<any> = ({token} : {token: IToken}): React.ReactElement => {
  return token?.status ? (
    <>
      {
        token?.status === VERIFIED_STATUS.PREMIUM ? (
          <Flex alignItems={"center"}>
            <Icon as={HiBadgeCheck} fontSize={"14px"} color={getTextColorStatus(token.status)}/>
          </Flex>
        ) : (
          <Flex
            // bgColor={getBgColorStatus(token.status)}
            color={getTextColorStatus(token.status)}
            gap={1}
            alignItems={"center"}
            // paddingX={2}
            paddingY={0}
            borderRadius={"8px"}
            fontSize={"xs"}
            fontWeight={"medium"}
          >
            <img
              src={`${CDN_URL}/icons/warning.svg`}
              alt="Trustless Market logo"
              style={{width: '18px', height: '18px'}}
            />
          </Flex>
        )
      }
    </>
  ) : <div/>;
};

export default VerifiedBadge;