/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {Flex, Icon, Text} from "@chakra-ui/react";
import {ImWarning} from "react-icons/im";
import {IToken} from '@/interfaces/token';

export const VERIFIED_STATUS = {
  WARNING: 'warning',
  CAUTION: 'caution',
  NORMAL: ''
}

export const getTextColorStatus = (status?: string) => {
  if(status === VERIFIED_STATUS.WARNING) {
    return "brand.danger.400";
  } else if (status === VERIFIED_STATUS.CAUTION) {
    return "brand.warning.400";
  } else {
    return "#FFFFFF";
  }
}

export const getBgColorStatus = (status: string) => {
  if(status === VERIFIED_STATUS.WARNING) {
    return "brand.danger.50";
  } else if (status === VERIFIED_STATUS.CAUTION) {
    return "brand.warning.50";
  } else {
    return "#FFFFFF";
  }
}

const VerifiedBadge: React.FC<any> = ({token} : {token: IToken}): React.ReactElement => {
  return token?.status ? (
    <Flex
      bgColor={getBgColorStatus(token.status)}
      color={getTextColorStatus(token.status)}
      gap={1}
      alignItems={"center"}
      paddingX={2}
      paddingY={0}
      borderRadius={"8px"}
      fontSize={"xs"}
      fontWeight={"medium"}
    >
      <Text textTransform={"capitalize"}>{token?.status}</Text>
      <Icon as={ImWarning} fontSize={"12px"}/>
    </Flex>
  ) : <div/>;
};

export default VerifiedBadge;