/* eslint-disable react-hooks/exhaustive-deps */
import React, { PropsWithChildren, useEffect, useMemo } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useAppDispatch } from '@/state/hooks';
import {
  resetUser,
  updateEVMWallet,
  updateSelectedWallet,
  updateTaprootWallet,
} from '@/state/user/reducer';
import { getConnection } from '@/connection';
import { useSelector } from 'react-redux';
import { getUserSelector } from '@/state/user/selector';
import bitcoinStorage from '@/utils/bitcoin-storage';
import { generateNonceMessage, verifyNonceMessage } from '@/services/auth';
// import { getAccessToken, setAccessToken } from '@/utils/auth-storage';
import { getAccessToken, setAccessToken } from '@/utils/auth-storage';
import { clearAuthStorage } from '@/utils/auth-storage';
import Web3 from 'web3';
import { provider } from 'web3-core';
import { switchChain } from '@/utils';
import { SupportedChainId } from '@/constants/chains';
// import { getCurrentProfile } from '@/services/profile';
import useAsyncEffect from 'use-async-effect';
import { useRouter } from 'next/router';
import { ROUTE_PATH } from '@/constants/route-path';
import * as TC_SDK from 'trustless-computer-sdk';
import { TEMP_ADDRESS_WALLET_EVM } from '@/constants/storage-key';
import { getCurrentProfile } from '@/services/profile';
import { isProduction } from '@/utils/commons';

export interface IWalletContext {
  onDisconnect: () => Promise<void>;
  onConnect: () => Promise<string | null>;
  requestBtcAddress: () => Promise<void>;
  getSignature: (_message: string) => Promise<string>;
}

const initialValue: IWalletContext = {
  onDisconnect: () => new Promise<void>((r) => r()),
  onConnect: () => new Promise<null>((r) => r(null)),
  getSignature: (_message: string) => new Promise<string>((r) => r('')),
  requestBtcAddress: () => new Promise<void>((r) => r()),
};

export const WalletContext = React.createContext<IWalletContext>(initialValue);

export const WalletProvider: React.FC<PropsWithChildren> = ({
  children,
}: PropsWithChildren): React.ReactElement => {
  const { connector, provider, chainId } = useWeb3React();
  const dispatch = useAppDispatch();
  const user = useSelector(getUserSelector);
  const router = useRouter();

  const disconnect = React.useCallback(async () => {
    console.log('disconnecting...');
    console.log('user', user);
    if (user?.walletAddress) {
      bitcoinStorage.removeUserTaprootAddress(user?.walletAddress);
    }
    if (connector && connector.deactivate) {
      await connector.deactivate();
    }
    await connector.resetState();
    clearAuthStorage();
    dispatch(resetUser());
  }, [connector, dispatch, user]);

  const connect = React.useCallback(async () => {
    const connection = getConnection(connector);
    if (!connection) {
      throw new Error('Get connection error.');
    }
    await connection.connector.activate();
    if (chainId !== SupportedChainId.TRUSTLESS_COMPUTER) {
      await switchChain(SupportedChainId.TRUSTLESS_COMPUTER);
    }
    const addresses = await connector.provider?.request({
      method: 'eth_accounts',
    });

    if (addresses && Array.isArray(addresses)) {
      const evmWalletAddress = addresses[0];
      const data = await generateNonceMessage({
        address: evmWalletAddress,
      });
      if (data) {
        const web3Provider = new Web3(window.ethereum as provider);
        const signature = await web3Provider.eth.personal.sign(
          Web3.utils.fromUtf8(data),
          evmWalletAddress,
          '',
        );
        const { token: accessToken, refreshToken } = await verifyNonceMessage({
          address: evmWalletAddress,
          signature: signature,
        });
        console.log('signature', signature);
        console.log('evmWalletAddress', evmWalletAddress);
        setAccessToken(accessToken, refreshToken);
        dispatch(updateEVMWallet(evmWalletAddress));
        dispatch(updateSelectedWallet({ wallet: connection.type }));
        localStorage.setItem(TEMP_ADDRESS_WALLET_EVM, evmWalletAddress);
        return evmWalletAddress;
      }
    }
    return null;
  }, [dispatch, connector, provider]);

  const getSignature = React.useCallback(
    async (message: string): Promise<string> => {
      const connection = getConnection(connector);
      if (!connection) {
        throw new Error('Get connection error.');
      }
      await connection.connector.activate();
      if (chainId !== SupportedChainId.TRUSTLESS_COMPUTER) {
        await switchChain(SupportedChainId.TRUSTLESS_COMPUTER);
      }
      const addresses = await connector.provider?.request({
        method: 'eth_accounts',
      });

      if (addresses && Array.isArray(addresses)) {
        const evmWalletAddress = addresses[0];

        const web3Provider = new Web3(window.ethereum as provider);
        const signature = await web3Provider.eth.personal.sign(
          Web3.utils.fromUtf8(message),
          evmWalletAddress,
          '',
        );

        return signature;
      }
      return '';
    },
    [dispatch, connector, provider],
  );

  useEffect(() => {
    if (user?.walletAddress && !user.walletAddressBtcTaproot) {
      const taprootAddress = bitcoinStorage.getUserTaprootAddress(
        user?.walletAddress,
      );
      if (!taprootAddress) return;
      dispatch(updateTaprootWallet(taprootAddress));
    }
  }, [user, dispatch]);

  const requestBtcAddress = async (): Promise<void> => {
    await TC_SDK.actionRequest({
      method: TC_SDK.RequestMethod.account,
      redirectURL: window.location.origin + window.location.pathname,
      target: '_self',
      isMainnet: isProduction(),
    });
  };

  useAsyncEffect(async () => {
    const accessToken = getAccessToken();

    if (connector && accessToken) {
      try {
        const connection = getConnection(connector);
        if (!connection) {
          throw new Error('Get connection error.');
        }

        try {
          await connection.connector.activate();
        } catch (err) {
          console.log(err);
        }

        if (chainId !== SupportedChainId.TRUSTLESS_COMPUTER) {
          await switchChain(SupportedChainId.TRUSTLESS_COMPUTER);
        }

        //temp for test evm
        // const walletAddress = localStorage.getItem(TEMP_ADDRESS_WALLET_EVM);

        const { walletAddress } = await getCurrentProfile();
        dispatch(updateEVMWallet(walletAddress));
        dispatch(updateSelectedWallet({ wallet: 'METAMASK' }));
      } catch (err: unknown) {
        clearAuthStorage();
        console.log(err);
      }
    }
  }, [dispatch, connector]);

  useEffect(() => {
    const handleAccountsChanged = async () => {
      console.log('accountsChanged');
      await disconnect();
      router.push(`${ROUTE_PATH.CONNECT_WALLET}?next=${ROUTE_PATH.HOME}`);
    };

    if (window.ethereum) {
      Object(window.ethereum).on('accountsChanged', handleAccountsChanged);
    }
  }, [disconnect]);

  useEffect(() => {
    const { tcAddress, tpAddress } = router.query as {
      tcAddress: string;
      tpAddress: string;
    };
    if (tpAddress) {
      dispatch(updateTaprootWallet(tpAddress));
      bitcoinStorage.setUserTaprootAddress(tcAddress, tpAddress);
      router.push(ROUTE_PATH.HOME);
    }
  }, [router]);

  const contextValues = useMemo((): IWalletContext => {
    return {
      onDisconnect: disconnect,
      onConnect: connect,
      requestBtcAddress,
      getSignature,
    };
  }, [disconnect, connect, requestBtcAddress]);

  return (
    <WalletContext.Provider value={contextValues}>{children}</WalletContext.Provider>
  );
};
