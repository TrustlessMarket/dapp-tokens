/* eslint-disable @typescript-eslint/no-explicit-any */
import {Box, Flex, Text} from '@chakra-ui/react';
import React from 'react';
import {IToken} from '@/interfaces/token';
import {TOKEN_ICON_DEFAULT} from '@/constants/common';
import px2rem from '@/utils/px2rem';
import styles from './styles.module.scss';
import {formatCurrency} from "@/utils";
import LaunchpadStatus from "@/modules/Launchpad/Launchpad.Status";
import VerifiedBadgeLaunchpad from "@/modules/Launchpad/verifiedBadgeLaunchpad";
import SocialToken from "@/components/Social";

const ProposalStarting = ({poolDetail}: any) => {
  const launchpadToken: IToken = poolDetail?.launchpadToken;

  return (
    <Box border={'1px solid #353945'} paddingX={6} paddingY={6}>
      <Flex justifyContent={'space-between'}>
        <Flex gap={4} color={'#FFFFFF'} alignItems={'center'}>
          <Flex alignItems={'flex-start'} h={'100%'}>
            <img src={launchpadToken.thumbnail || TOKEN_ICON_DEFAULT} className={"launchpad-token-avatar"}/>
          </Flex>
          <Flex direction={"column"} gap={2}>
            <Flex gap={1} fontSize={px2rem(24)} fontWeight={'500'}>
              {launchpadToken.name} <span style={{color: 'rgba(255,255,255,0.7)'}}>{launchpadToken.symbol}</span>
              <VerifiedBadgeLaunchpad launchpad={poolDetail}/>
            </Flex>
            <Flex alignItems={"center"} gap={2}>
              <Text className={styles.boxProposalId}>Launchpad #{formatCurrency(poolDetail.id, 0)}</Text>
              <LaunchpadStatus row={poolDetail} />
            </Flex>
            <SocialToken socials={poolDetail?.launchpadToken?.social} />
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
};

export default ProposalStarting;
