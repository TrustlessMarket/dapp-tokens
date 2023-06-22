/* eslint-disable @typescript-eslint/no-explicit-any */
import { CDN_URL } from '@/configs';
import { ROUTE_PATH } from '@/constants/route-path';
import { PREV_URL } from '@/constants/storage-key';
import { WalletContext } from '@/contexts/wallet-context';
import { Container } from '@/layouts';
import { getIsAuthenticatedSelector, getUserSelector } from '@/state/user/selector';
import { showError } from '@/utils/toast';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ConnectWalletButton, Wrapper } from './ConnectWallet.styled';

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
      const message = (err as Error).message;
      if (
        !message.toLowerCase()?.includes('User rejected the request'.toLowerCase())
      ) {
        showError({
          message,
        });
        onDisconnect();
      }
    } finally {
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      let nextRouter: any = ROUTE_PATH.HOME;
      const prevUrl = window.localStorage.getItem(PREV_URL);
      if (prevUrl) {
        nextRouter = prevUrl;
      }
      router.push(nextRouter);
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
