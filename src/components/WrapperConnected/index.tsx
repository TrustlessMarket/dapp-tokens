import {WalletContext} from '@/contexts/wallet-context';
import {showError} from '@/utils/toast';
import React, {useContext} from 'react';
import {StyledWrapperConnected} from './WrapperConnected.styled';
import {ButtonProps} from '../Button';
import {useWeb3React} from "@web3-react/core";

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
  const { isActive } = useWeb3React();
  const { onDisconnect, onConnect, requestBtcAddress } = useContext(WalletContext);

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

  const handleClick = () => {
    if (!isActive) {
      handleConnectWallet();
    } else {
      onClick?.();
    }
  };

  if (isActive) {
    return <>{children}</>;
  }

  return (
    <StyledWrapperConnected {...children?.props} type={isActive ? type : 'button'} onClick={handleClick} className={className}>
      {children?.props?.children}
    </StyledWrapperConnected>
  );
};

export default WrapperConnected;
