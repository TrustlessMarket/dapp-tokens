/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Flex, Text } from '@chakra-ui/react';
import BuyForm from '@/modules/ProposalDetail/form';
import Card from '@/components/Swap/card';
import React from 'react';
import { IToken } from '@/interfaces/token';
import { TOKEN_ICON_DEFAULT } from '@/constants/common';
import px2rem from '@/utils/px2rem';
import styles from './styles.module.scss';
import {formatCurrency} from "@/utils";
import LaunchpadStatus, {LAUNCHPAD_STATUS} from "@/modules/Launchpad/Launchpad.Status";

const ProposalStarting = ({poolDetail}: any) => {
  const launchpadToken: IToken = poolDetail?.launchpadToken;

  return (
    <Box border={'1px solid #353945'} paddingX={6} paddingY={6}>
      <Flex justifyContent={'space-between'} mb={6}>
        <Flex gap={4} color={'#FFFFFF'} alignItems={'center'}>
          <Flex alignItems={'flex-start'} h={'100%'}>
            <img src={launchpadToken.thumbnail || TOKEN_ICON_DEFAULT} className={"launchpad-token-avatar"}/>
          </Flex>
          <Box>
            <Text fontSize={px2rem(24)} fontWeight={'500'}>
              {launchpadToken.name} <span style={{color: 'rgba(255,255,255,0.7)'}}>{launchpadToken.symbol}</span>
            </Text>
            <Flex alignItems={"center"} mt={2} gap={2}>
              <Text className={styles.boxProposalId}>Launchpad #{formatCurrency(poolDetail.id, 0)}</Text>
              <LaunchpadStatus row={poolDetail} />
            </Flex>
          </Box>
        </Flex>
        {
          [LAUNCHPAD_STATUS.Voting].includes(poolDetail?.state) && (
            <Card bgColor={"transparent"} paddingX={6}>
              <BuyForm poolDetail={poolDetail}/>
            </Card>
          )
        }
      </Flex>
    </Box>
  );
};

export default ProposalStarting;
