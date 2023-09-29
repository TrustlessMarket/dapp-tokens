/* eslint-disable @typescript-eslint/no-explicit-any */
import BodyContainer from '@/components/Swap/bodyContainer';
import { GM_ADDRESS, WETH_ADDRESS } from '@/constants/common';
import { ROUTE_PATH } from '@/constants/route-path';
import TokenHistory from '@/modules/SwapHistory/Token.History';
import { Box, Button, Flex, Text } from '@chakra-ui/react';
import Link from 'next/link';
import styles from './styles.module.scss';
import {L2_ETH_ADDRESS, L2_WBTC_ADDRESS} from "@/configs";
import useCheckIsLayer2 from "@/hooks/useCheckIsLayer2";

const SwapHistory = () => {
  const isL2 = useCheckIsLayer2();
  const routePathSwap = isL2 ? ROUTE_PATH.SWAP_V2 : ROUTE_PATH.SWAP;
  const routePathPools = isL2 ? ROUTE_PATH.POOLS_V2 : ROUTE_PATH.POOLS;
  const from_token = isL2 ? L2_ETH_ADDRESS : WETH_ADDRESS;
  const to_token = isL2 ? L2_WBTC_ADDRESS : GM_ADDRESS;

  return (
    <BodyContainer className={styles.wrapper}>
      <Text className="upload_title" as="h3">
        Swap History
      </Text>
      <Flex
        gap={[4, 8]}
        mt={[3, 6]}
        mb={12}
        justifyContent={'center'}
        w={'100%'}
        flexDirection={['column', 'row']}
        alignItems={'center'}
      >
        <Link
          href={`${routePathSwap}?from_token=${from_token}&to_token=${to_token}`}
        >
          <Button className={styles.swapButton}>Swap now</Button>
        </Link>
        <Link href={routePathPools}>
          <Button
            className={styles.addLiquidityButton}
            bg={'white'}
            background={'#3385FF'}
          >
            Add liquidity
          </Button>
        </Link>
      </Flex>
      <Box marginX={'auto'} mt={6}>
        <TokenHistory />
      </Box>
    </BodyContainer>
  );
};

export default SwapHistory;
