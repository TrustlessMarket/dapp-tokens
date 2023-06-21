/* eslint-disable @typescript-eslint/no-explicit-any */
import BodyContainer from '@/components/Swap/bodyContainer';
import { GM_ADDRESS, WETH_ADDRESS } from '@/constants/common';
import { ROUTE_PATH } from '@/constants/route-path';
import TokenHistory from '@/modules/SwapHistory/Token.History';
import { Box, Button, Flex, Text } from '@chakra-ui/react';
import Link from 'next/link';
import styles from './styles.module.scss';

const TMTransferHistory = () => {
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
          href={`${ROUTE_PATH.SWAP}?from_token=${WETH_ADDRESS}&to_token=${GM_ADDRESS}`}
        >
          <Button className={styles.swapButton}>Swap now</Button>
        </Link>
        <Link href={ROUTE_PATH.POOLS}>
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

export default TMTransferHistory;
