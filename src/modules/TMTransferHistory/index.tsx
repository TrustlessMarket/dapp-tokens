/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from "@/modules/TMTransferHistory/styles.module.scss";
import BodyContainer from "@/components/Swap/bodyContainer";
import SectionContainer from "@/components/Swap/sectionContainer";
import TokenHistory from "@/modules/TMTransferHistory/Token.History";
import {Box, Flex, Text} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {TM_ADDRESS} from "@/configs";
import {useWeb3React} from "@web3-react/core";
import {useSelector} from "react-redux";
import {getUserSelector} from "@/state/user/selector";
import useBalanceERC20Token from "@/hooks/contract-operations/token/useBalanceERC20Token";
import {formatCurrency} from "@/utils";

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
        <Flex direction={"column"} color={"#FFFFFF"} bg={"#1E1E22"} borderRadius={"8px"} p={6} w={"250px"} marginX={"auto"}>
          <Text fontSize={"20px"}>TM Balance</Text>
          <Text fontSize={"16px"}>{formatCurrency(balanceTM, 5)} TM</Text>
        </Flex>
        <Box maxW={"600px"} marginX={"auto"} mt={6}>
          <TokenHistory />
        </Box>
      </SectionContainer>
    </BodyContainer>
  );
};

export default TMTransferHistory;
