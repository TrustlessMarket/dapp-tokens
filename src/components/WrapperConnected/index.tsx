/* eslint-disable @typescript-eslint/no-explicit-any */
import {WalletContext} from '@/contexts/wallet-context';
import {getIsAuthenticatedSelector} from '@/state/user/selector';
import {compareString, isSupportedChain} from '@/utils';
import {showError} from '@/utils/toast';
import {useWeb3React} from '@web3-react/core';
import React, {useContext} from 'react';
import {useSelector} from 'react-redux';
import {ButtonProps} from '../Button';
import {StyledWrapperConnected} from './WrapperConnected.styled';
import {SupportedChainId} from "@/constants/chains";

interface WrapperConnectedProps extends ButtonProps {
  children?: React.ReactElement;
  onClick?: () => void;
  className?: string;
  forceSwitchChain?: any;
}

const WrapperConnected: React.FC<WrapperConnectedProps> = ({
  children,
  onClick,
  className,
  type = 'button',
  forceSwitchChain = false,
}) => {
  const { chainId } = useWeb3React();
  const { onDisconnect, onConnect, requestBtcAddress } = useContext(WalletContext);
  const trustChain = isSupportedChain(chainId);
  const isAuthenticated = useSelector(getIsAuthenticatedSelector);

  const isTCChain = chainId && compareString(
      SupportedChainId.TRUSTLESS_COMPUTER,
      chainId,
    );
  const isNOSChain = chainId && compareString(
      SupportedChainId.L2,
      chainId,
    );

  const handleConnectWallet = async () => {
    try {
      await onConnect();
      await requestBtcAddress();
    } catch (err) {
      const message = (err as Error).message;
      if (
        !message.toLowerCase()?.includes('User rejected the request'.toLowerCase())
      ) {
        showError({
          message,
        });
        onDisconnect();
      }
    }
  };

  const handleClick = (e: any) => {
    e.stopPropagation();
    e.preventDefault();

    if (!isAuthenticated || !trustChain || (!isTCChain && forceSwitchChain)) {
      handleConnectWallet();
    } else {
      onClick?.();
    }
  };

  if (!isAuthenticated || !trustChain || (!isTCChain && !isNOSChain && forceSwitchChain)) {
    return (
      <StyledWrapperConnected
        {...children?.props}
        type={isAuthenticated || trustChain ? type : 'button'}
        onClick={handleClick}
        className={className}
      >
        {!isAuthenticated ? children?.props?.children : 'Switch network now'}
      </StyledWrapperConnected>
    );
  }

  return <>{children}</>;
};

export default WrapperConnected;
