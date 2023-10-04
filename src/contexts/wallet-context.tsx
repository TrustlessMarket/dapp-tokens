/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { ConnectionType, getConnection } from '@/connection';
import { generateNonceMessage, verifyNonceMessage } from '@/services/auth';
import { useAppDispatch } from '@/state/hooks';
import {
  resetUser,
  updateEVMWallet,
  updateSelectedWallet,
  updateTaprootWallet,
} from '@/state/user/reducer';
import { getUserSelector } from '@/state/user/selector';
import bitcoinStorage from '@/utils/bitcoin-storage';
import { useWeb3React } from '@web3-react/core';
import React, { PropsWithChildren, useCallback, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
// import { getAccessToken, setAccessToken } from '@/utils/auth-storage';
import { SupportedChainId } from '@/constants/chains';
import {
  CHAIN_ID,
  compareString,
  getChainList,
  getLocalStorageChainInfo,
  isSupportedChain,
  switchChain,
} from '@/utils';
import {
  clearAuthStorage,
  getAccessToken,
  setAccessToken,
} from '@/utils/auth-storage';
import Web3 from 'web3';
import { provider } from 'web3-core';
import { ROUTE_PATH } from '@/constants/route-path';
import {
  CHAIN_INFO,
  PREV_CHAIN_ID,
  PREV_URL,
  TEMP_ADDRESS_WALLET_EVM,
} from '@/constants/storage-key';
import { IResourceChain } from '@/interfaces/chain';
import { getCurrentProfile } from '@/services/profile';
import {
  currentChainSelector,
  updateCurrentChain,
  updateCurrentChainId,
} from '@/state/pnftExchange';
import { isProduction } from '@/utils/commons';
import { useRouter } from 'next/router';
import * as TC_SDK from 'trustless-computer-sdk';
import useAsyncEffect from 'use-async-effect';

export interface IWalletContext {
  onDisconnect: () => Promise<void>;
  onConnect: () => Promise<string | null>;
  requestBtcAddress: () => Promise<void>;
  getDefaultChain: () => any;
  getConnectedChainInfo: () => any;
  getSignature: (_message: string) => Promise<string>;
}

const initialValue: IWalletContext = {
  onDisconnect: () => new Promise<void>((r) => r()),
  onConnect: () => new Promise<null>((r) => r(null)),
  requestBtcAddress: () => new Promise<void>((r) => r()),
  getDefaultChain: () => {},
  getConnectedChainInfo: () => {},
  getSignature: (_message: string) => new Promise<string>((r) => r('')),
};

export const WalletContext = React.createContext<IWalletContext>(initialValue);

export const WalletProvider: React.FC<PropsWithChildren> = ({
                                                              children,
                                                            }: PropsWithChildren): React.ReactElement => {
  const { connector, provider, chainId } = useWeb3React();
  const dispatch = useAppDispatch();
  const user = useSelector(getUserSelector);
  const currentChain: IResourceChain = useSelector(currentChainSelector);
  const currentChainId = currentChain?.chainId;
  const router = useRouter();

  const getDefaultChain = useCallback(() => {
    const getChainInfo: IResourceChain = getLocalStorageChainInfo();
    return getChainInfo?.chainId || SupportedChainId.L2;
  }, [router]);

  const getConnectedChainInfo = useCallback(() => {
    return getLocalStorageChainInfo();
  }, [router, user, chainId]);

  const isChain: any = currentChainId || getDefaultChain();

  const isChainTC =
    !currentChainId ||
    compareString(currentChainId, CHAIN_ID.TRUSTLESS_COMPUTER);

  const getSignature = React.useCallback(
    async (message: string): Promise<string> => {
      const connection = getConnection(connector);
      if (!connection) {
        throw new Error('Get connection error.');
      }
      await connection.connector.activate();
      if (!isSupportedChain(chainId)) {
        await switchChain(getDefaultChain(), connection);
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

  const disconnect = React.useCallback(async () => {
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
    try {
      const connection = getConnection(connector);
      if (!connection) {
        throw new Error('Get connection error.');
      }
      await connection.connector.activate();

      if (!isSupportedChain(isChain) || !compareString(chainId, isChain)) {
        await switchChain(isChain, connection);
      }
      const addresses: any = await connector.provider?.request({
        method: 'eth_accounts',
        params: [{ chainId: Web3.utils.toHex(isChain) }],
      });

      await onConnect(addresses);
    } catch (error) {
      console.log('error', error);

      throw error;
    }

    return null;
  }, [dispatch, connector, provider, currentChainId, chainId]);

  useEffect(() => {
    if (user?.walletAddress && !user.walletAddressBtcTaproot) {
      const taprootAddress = bitcoinStorage.getUserTaprootAddress(
        user?.walletAddress,
      );
      if (!taprootAddress) return;
      dispatch(updateTaprootWallet(taprootAddress));
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (isSupportedChain(chainId)) {
      onSwitchChain(chainId);
    }
  }, [chainId]);

  const onSwitchChain = async (chainId: any) => {
    try {
      dispatch(updateCurrentChainId(chainId));
      const chainList = await getChainList();
      const info = chainList.find((c: IResourceChain) => c.chainId === chainId);
      if (!info) {
        throw new Error(`Chain ${chainId} not supported`);
      }
      localStorage.setItem(CHAIN_INFO, JSON.stringify(info));
    } catch (error) {
      throw error;
    }
  };

  const onConnect = async (addresses: any[]) => {
    if (addresses && Array.isArray(addresses)) {
      const evmWalletAddress = addresses[0];

      if (isChainTC) {
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
          setAccessToken(accessToken, refreshToken);
        }
      }

      const chainList = await getChainList();
      const info = chainList.find((c: IResourceChain) =>
        compareString(c.chainId, isChain),
      );
      if (!info) {
        throw new Error(`Chain ${chainId} not supported`);
      }

      localStorage.setItem(CHAIN_INFO, JSON.stringify(info));

      localStorage.setItem(PREV_URL, window.location.href);
      localStorage.setItem(PREV_CHAIN_ID, isChain);
      dispatch(updateEVMWallet(evmWalletAddress));
      dispatch(updateSelectedWallet({ wallet: ConnectionType.METAMASK }));
      localStorage.setItem(TEMP_ADDRESS_WALLET_EVM, evmWalletAddress);

      return evmWalletAddress;
    }
  };

  const requestBtcAddress = async (): Promise<void> => {
    if (isChainTC) {
      await TC_SDK.actionRequest({
        method: TC_SDK.RequestMethod.account,
        redirectURL: window.location.origin + window.location.pathname,
        target: '_self',
        isMainnet: isProduction(),
      });
    }
  };

  useAsyncEffect(async () => {
    const accessToken = getAccessToken();

    const prevChainId: any = getDefaultChain();
    const hasLogged: any = localStorage.getItem(PREV_CHAIN_ID);

    if (connector) {
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

        // if (!isSupportedChain(prevChainId)) {
        //   await switchChain(isChain);
        // }

        if (!currentChain) {
          dispatch(updateCurrentChain(getLocalStorageChainInfo()));
          dispatch(updateCurrentChainId(getLocalStorageChainInfo()?.chainId));
        }

        if (accessToken) {
          const { walletAddress } = await getCurrentProfile();
          dispatch(updateEVMWallet(walletAddress));
          dispatch(updateSelectedWallet({ wallet: 'METAMASK' }));
        } else if (prevChainId && hasLogged) {
          const addresses: any = await connector.provider?.request({
            method: 'eth_accounts',
            params: [{ chainId: Web3.utils.toHex(prevChainId) }],
          });
          const evmWalletAddress = addresses[0];

          dispatch(updateCurrentChainId(prevChainId));
          dispatch(updateEVMWallet(evmWalletAddress));
          dispatch(updateSelectedWallet({ wallet: ConnectionType.METAMASK }));
          localStorage.setItem(TEMP_ADDRESS_WALLET_EVM, evmWalletAddress);
        }
      } catch (err: unknown) {
        clearAuthStorage();
        console.log(err);
      }
    }
  }, [dispatch, connector]);

  useEffect(() => {
    const handleAccountsChanged = async (addresses: any[]) => {
      if (addresses && Array.isArray(addresses)) {
        // await disconnect();
        const evmWalletAddress = addresses[0];
        dispatch(updateEVMWallet(evmWalletAddress));
        dispatch(updateSelectedWallet({ wallet: ConnectionType.METAMASK }));
        localStorage.setItem(TEMP_ADDRESS_WALLET_EVM, evmWalletAddress);
      }
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
      let nextRouter: any = ROUTE_PATH.HOME;
      const prevUrl = window.localStorage.getItem(PREV_URL);
      if (prevUrl) {
        nextRouter = prevUrl;
      }
      router.push(nextRouter);
    }
  }, [router]);

  const contextValues = useMemo((): IWalletContext => {
    return {
      onDisconnect: disconnect,
      onConnect: connect,
      requestBtcAddress,
      getSignature,
      getDefaultChain,
      getConnectedChainInfo,
    };
  }, [disconnect, connect, requestBtcAddress]);

  return (
    <WalletContext.Provider value={contextValues}>{children}</WalletContext.Provider>
  );
};
