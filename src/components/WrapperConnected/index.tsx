import { WalletContext } from '@/contexts/wallet-context';
import { getIsAuthenticatedSelector } from '@/state/user/selector';
import { showError } from '@/utils/toast';
import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { StyledWrapperConnected } from './WrapperConnected.styled';
import { ButtonProps } from '../Button';

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
  const isAuthenticated = useSelector(getIsAuthenticatedSelector);
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
    if (!isAuthenticated) {
      handleConnectWallet();
    } else {
      onClick?.();
    }
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <StyledWrapperConnected type={isAuthenticated ? type : 'button'} onClick={handleClick} className={className}>
      {children}
    </StyledWrapperConnected>
  );
};

export default WrapperConnected;
