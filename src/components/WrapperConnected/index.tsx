/* eslint-disable @typescript-eslint/no-explicit-any */
import {WalletContext} from '@/contexts/wallet-context';
import {showError} from '@/utils/toast';
import React, {useContext} from 'react';
import {StyledWrapperConnected} from './WrapperConnected.styled';
import {ButtonProps} from '../Button';
import {isConnectedTrustChain} from "@/utils";
import {useSelector} from "react-redux";
import {getIsAuthenticatedSelector} from "@/state/user/selector";

interface WrapperConnectedProps extends ButtonProps {
  children?: React.ReactElement;
  onClick?: () => void;
  className?: string;
}

const WrapperConnected: React.FC<WrapperConnectedProps> = ({
  children,
  onClick,
  className,
  type = 'button',
}) => {
  const { onDisconnect, onConnect, requestBtcAddress } = useContext(WalletContext);
  const trustChain = isConnectedTrustChain();
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

  if (!isAuthenticated || !trustChain) {
    return (
      <StyledWrapperConnected {...children?.props} type={(isAuthenticated || trustChain) ? type : 'button'} onClick={handleClick} className={className}>
        {!isAuthenticated ? children?.props?.children : 'Switch to Trustless Computer Network'}
      </StyledWrapperConnected>
    );
  }

  return <>{children}</>;
};

export default WrapperConnected;
