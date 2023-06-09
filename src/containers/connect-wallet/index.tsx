import React, { useContext, useEffect, useState } from 'react';
import { Wrapper, ConnectWalletButton } from './ConnectWallet.styled';
import { WalletContext } from '@/contexts/wallet-context';
import { useSelector } from 'react-redux';
import { getIsAuthenticatedSelector, getUserSelector } from '@/state/user/selector';
import { CDN_URL } from '@/configs';
import { Container } from '@/layouts';
import { ROUTE_PATH } from '@/constants/route-path';
import { useRouter } from 'next/router';
import { showError } from '@/utils/toast';

const ConnectWallet: React.FC = (): React.ReactElement => {
  const { onConnect, requestBtcAddress, onDisconnect } = useContext(WalletContext);
  const isAuthenticated = useSelector(getIsAuthenticatedSelector);
  const user = useSelector(getUserSelector);
  const router = useRouter();
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

  useEffect(() => {
    if (isAuthenticated) {
      router.push(ROUTE_PATH.HOME);
    }
  }, [isAuthenticated, router, user]);

  return (
    <Container>
      <Wrapper>
        <div className="header">
          <div className="socialContainer">
            <a href="https://generative.xyz/discord" target="_blank">
              <img
                alt="icon"
                className="icon"
                src={`${CDN_URL}/icons/ic-discord-18x18.svg`}
              />
            </a>
            <a href="https://twitter.com/DappsOnBitcoin" target="_blank">
              <img
                alt="icon"
                className="icon"
                src={`${CDN_URL}/icons/ic-twitter-18x18.svg`}
              />
            </a>
          </div>
        </div>
        <div className="mainContent">
          <h1 className="title">{`Connect Wallet`}</h1>
          <p className="desc">
            {`Connect your wallet to access New Bitcoin DEX on Trustless Computer.`}
          </p>
          <ConnectWalletButton disabled={isConnecting} onClick={handleConnectWallet}>
            {isConnecting ? 'Connecting...' : 'Connect wallet'}
          </ConnectWalletButton>
        </div>
      </Wrapper>
    </Container>
  );
};

export default ConnectWallet;
