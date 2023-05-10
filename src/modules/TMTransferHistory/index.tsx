/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from "@/modules/TMTransferHistory/styles.module.scss";
import BodyContainer from "@/components/Swap/bodyContainer";
import SectionContainer from "@/components/Swap/sectionContainer";
import TokenHistory from "@/modules/TMTransferHistory/Token.History";
import {Box, Button, Flex, Text} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {TM_ADDRESS} from "@/configs";
import {useWeb3React} from "@web3-react/core";
import {useSelector} from "react-redux";
import {getUserSelector} from "@/state/user/selector";
import useBalanceERC20Token from "@/hooks/contract-operations/token/useBalanceERC20Token";
import {formatCurrency} from "@/utils";
import px2rem from "@/utils/px2rem";
import Link from "next/link";
import {ROUTE_PATH} from "@/constants/route-path";

const TMTransferHistory = () => {
  const { isActive } = useWeb3React();
  const user = useSelector(getUserSelector);
  const { call: getBalanceErc20 } = useBalanceERC20Token();
  const [balanceTM, setBalanceTM] = useState('0');

  useEffect(() => {
    getBalanceTM();
  }, [user?.walletAddress, isActive]);

  const getBalanceTM = async () => {
    if (!user?.walletAddress || !isActive) {
      return;
    }

    try {
      const response: any = await getBalanceErc20({
        erc20TokenAddress: TM_ADDRESS,
      });
      setBalanceTM(response);
    } catch (error) {}
  };

  return (
    <BodyContainer className={styles.wrapper}>
      <SectionContainer>
        <Text fontSize={px2rem(24)} color={"#FFFFFF"} textAlign={"center"} paddingX={[0, 0]}>TM is the governance token of our swap dApp and also functions as a utility token. Early users who participate in token swaps or liquidity provision on the swap dApp are allocated 5% of the total supply of TM tokens. This incentivizes active participation in our platform and allows users to have greater control over the governance of the dApp.</Text>
        <Flex gap={8} mt={6} mb={12} justifyContent={"center"} w={"100%"}>
          <Link href={ROUTE_PATH.SWAP} flex={1}>
            <Button
              className={styles.swapButton}
            >
              Swap more
            </Button>
          </Link>
          <Link href={ROUTE_PATH.POOLS} flex={1}>
            <Button
              className={styles.addLiquidityButton}
              bg={'white'}
              background={'#3385FF'}
            >
              Add liquidity
            </Button>
          </Link>
        </Flex>
        <Box maxW={"800px"} marginX={"auto"} mt={6}>
          <Text fontSize={"20px"} color={"#FFFFFF"} ml={1}>Your balance: {formatCurrency(balanceTM, 5)} TM</Text>
          <TokenHistory />
        </Box>
      </SectionContainer>
    </BodyContainer>
  );
};

export default TMTransferHistory;
