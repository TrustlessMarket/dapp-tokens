import {Flex, Text} from "@chakra-ui/react";
import React, {useContext, useState} from "react";
import {RiErrorWarningLine} from "react-icons/ri";
import FiledButton, {FiledButtonProps} from "@/components/Swap/button/filedButton";
import {useWeb3React} from "@web3-react/core";
import {useSelector} from "react-redux";
import {getIsAuthenticatedSelector, getUserSelector} from "@/state/user/selector";
import {WalletContext} from "@/contexts/wallet-context";
import {AssetsContext} from "@/contexts/assets-context";
import {showError} from "@/utils/toast";

interface WrapButtonConnectWalletProps {
  children?: any;
  buttonConfig?: FiledButtonProps | undefined | null;
  showBtnConnect?: boolean;
  labelNoConnect?: string;
  showSwitchButton?: boolean;
  labelSwitchChain?: string;
  showIcon?: boolean;
}

const WrapButtonConnectWallet: React.FC<WrapButtonConnectWalletProps> = ({
  children,
  buttonConfig,
  showBtnConnect,
  labelNoConnect = "Please connect wallet",
  showSwitchButton = true,
  labelSwitchChain = "Switch for me",
  showIcon = true,
}) => {
  const { account } = useWeb3React();
  const user = useSelector(getUserSelector);
  const { onDisconnect, onConnect, requestBtcAddress } = useContext(WalletContext);

  const isAuthenticated = useSelector(getIsAuthenticatedSelector);
  const { btcBalance, juiceBalance } = useContext(AssetsContext);

  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnectWallet = async () => {
    try {
      setIsConnecting(true);
      await onConnect();
      await requestBtcAddress();
    } catch (err) {
      showError({
        message: (err as Error).message,
      });
      console.log(err);
      onDisconnect();
    } finally {
      setIsConnecting(false);
    }
  };

  if (!(account && isAuthenticated)) {
    if (showBtnConnect) {
      return (
        <FiledButton
          // isLoading={isConnecting}
          loadingText="Connecting..."
          onClick={handleConnectWallet}
          {...buttonConfig}
        >
          {isConnecting ? 'Connecting...' : 'Connect wallet'}
        </FiledButton>
      );
    }
    return (
      <Flex
        mt={2}
        mb={2}
        justifyContent={"center"}
        alignItems={"center"}
        gap={1}
      >
        <RiErrorWarningLine color={"#EF466F"} opacity={0.8} />
        <Text
          fontSize={"14px"}
          fontWeight="500"
          color={"#EF466F"}
          opacity={0.8}
        >
          {labelNoConnect}
        </Text>
      </Flex>
    );
  }

  return (
    <>
      {children}
    </>
  );
};

export default WrapButtonConnectWallet;
