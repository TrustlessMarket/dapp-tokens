import { WalletContext } from '@/contexts/wallet-context';
import { getIsAuthenticatedSelector } from '@/state/user/selector';
import { showError } from '@/utils/toast';
import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { ButtonProps } from '../Button';
import { StyledWrapperConnected } from './WrapperConnected.styled';

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
  const { onDisconnect, onConnect } = useContext(WalletContext);

  const handleConnectWallet = async () => {
    try {
      await onConnect();
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
    <StyledWrapperConnected
      {...children?.props}
      type={isAuthenticated ? type : 'button'}
      onClick={handleClick}
      className={className}
    >
      {children?.props?.children}
    </StyledWrapperConnected>
  );
};

export default WrapperConnected;
