/* eslint-disable @typescript-eslint/no-explicit-any */
import { WalletContext } from '@/contexts/wallet-context';
import { getIsAuthenticatedSelector } from '@/state/user/selector';
import { isConnectedTrustChain } from '@/utils';
import { showError } from '@/utils/toast';
import { useWeb3React } from '@web3-react/core';
import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { ButtonProps } from '../Button';
import { StyledWrapperConnected } from './WrapperConnected.styled';

interface WrapperConnectedProps extends ButtonProps {
  children?: React.ReactElement;
  onClick?: () => void;
  className?: string;
  forceSwitchChain?: boolean;
}

const WrapperConnected: React.FC<WrapperConnectedProps> = ({
  children,
  onClick,
  className,
  type = 'button',
  forceSwitchChain = true,
}) => {
  const { chainId } = useWeb3React();
  const { onDisconnect, onConnect, requestBtcAddress } = useContext(WalletContext);
  const trustChain = isConnectedTrustChain(chainId);
  const isAuthenticated = useSelector(getIsAuthenticatedSelector);

  const handleConnectWallet = async () => {
    try {
      await onConnect();
      await requestBtcAddress();
    } catch (err) {
      showError({
        message: (err as Error).message,
      });
      onDisconnect();
    }
  };

  const handleClick = (e: any) => {
    e.stopPropagation();
    e.preventDefault();

    if (!isAuthenticated || !trustChain) {
      handleConnectWallet();
    } else {
      onClick?.();
    }
  };

  if (!isAuthenticated || (!trustChain && forceSwitchChain)) {
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
