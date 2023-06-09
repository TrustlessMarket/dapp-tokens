/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {Box, Flex, Icon} from "@chakra-ui/react";
import {HiBadgeCheck} from "react-icons/hi";
import {IToken} from '@/interfaces/token';
import {CDN_URL} from "@/configs";
import InfoTooltip from "@/components/Swap/infoTooltip";

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

const VerifiedBadge: React.FC<any> = ({token, onlyWarning = false} : {token: IToken, onlyWarning: boolean}): React.ReactElement => {
  return token?.status ? (
    <>
      {
        token?.status === VERIFIED_STATUS.PREMIUM ? (
          <>
            {
              !onlyWarning && (
                <Flex alignItems={"center"}>
                  <Icon as={HiBadgeCheck} fontSize={"14px"} color={getTextColorStatus(token.status)}/>
                </Flex>
              )
            }
          </>
        ) : (
          <InfoTooltip
            label={
              <Box
                fontWeight={"400"}
                dangerouslySetInnerHTML={{ __html: `This tokens name is similar to a different verified token — be aware of the similar spelling when trading this token.` }}
              />
            }
          >
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
                alt="New Bitcoin DEX logo"
                style={{width: '18px', height: '18px'}}
              />
            </Flex>
          </InfoTooltip>
        )
      }
    </>
  ) : <div/>;
};

export default VerifiedBadge;