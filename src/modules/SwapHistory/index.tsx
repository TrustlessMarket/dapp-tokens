/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from "./styles.module.scss";
import BodyContainer from "@/components/Swap/bodyContainer";
import SectionContainer from "@/components/Swap/sectionContainer";
import TokenHistory from "@/modules/SwapHistory/Token.History";
import {Box, Button, Flex, Text} from "@chakra-ui/react";
import px2rem from "@/utils/px2rem";
import Link from "next/link";
import {ROUTE_PATH} from "@/constants/route-path";
import {GM_ADDRESS, WETH_ADDRESS} from "@/constants/common";

const TMTransferHistory = () => {
  return (
    <BodyContainer className={styles.wrapper}>
      <SectionContainer>
        <Text fontSize={px2rem(48)} fontWeight={"medium"} color={"#FFFFFF"} textAlign={"center"} paddingX={[0, 0]}>Swap History</Text>
        <Flex gap={8} mt={6} mb={12} justifyContent={"center"} w={"100%"}>
          <Link
            href={`${ROUTE_PATH.SWAP}?from_token=${WETH_ADDRESS}&to_token=${GM_ADDRESS}`}
          >
            <Button
              className={styles.swapButton}
            >
              Swap now
            </Button>
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
        <Box marginX={"auto"} mt={6}>
          <TokenHistory />
        </Box>
      </SectionContainer>
    </BodyContainer>
  );
};

export default TMTransferHistory;
