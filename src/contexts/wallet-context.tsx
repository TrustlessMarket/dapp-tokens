/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { ConnectionType, getConnector } from '@/connection';
import { useAppDispatch } from '@/state/hooks';
import {
  resetUser,
  updateEVMWallet,
  updateSelectedWallet,
  updateTaprootWallet,
} from '@/state/user/reducer';
import { getUserSelector } from '@/state/user/selector';
import bitcoinStorage from '@/utils/bitcoin-storage';
import React, { PropsWithChildren, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
// import { getAccessToken, setAccessToken } from '@/utils/auth-storage';
import { getDefaultProvider } from '@/utils';
import { clearAuthStorage } from '@/utils/auth-storage';
// import { getCurrentProfile } from '@/services/profile';
import { ROUTE_PATH } from '@/constants/route-path';
import {
  TAPROOT_WALLET_ADDRESS,
  TC_ACCOUNTS,
  TC_WALLET_ADDRESS,
} from '@/constants/storage-key';
import { useRouter } from 'next/router';
import useAsyncEffect from 'use-async-effect';
import { addAccounts } from '@/state/wallets/reducer';
import { IAccount } from '@/state/wallets/types';

export interface IWalletContext {
  onDisconnect: () => Promise<void>;
  onConnect: () => Promise<string | null>;
  getSignature: ({
    message,
    account,
  }: {
    message: string;
    account: string;
  }) => Promise<string>;
  onChangeAccount: (r: IAccount) => any;
}

const initialValue: IWalletContext = {
  onDisconnect: () => new Promise<void>((r) => r()),
  onConnect: () => new Promise<null>((r) => r(null)),
  getSignature: ({ message, account }: { message: string; account: string }) =>
    new Promise<string>((r) => r('')),
  onChangeAccount: (_r: IAccount) => void ((r: () => any) => r()),
};

export const WalletContext = React.createContext<IWalletContext>(initialValue);

export const WalletProvider: React.FC<PropsWithChildren> = ({
  children,
}: PropsWithChildren): React.ReactElement => {
  const provider = getDefaultProvider();
  const dispatch = useAppDispatch();
  const user = useSelector(getUserSelector);
  const router = useRouter();
  const connector = getConnector();

  const getSignature = React.useCallback(
    async ({ message, account }: { message: string; account: string }) => {
      const response = await connector.requestSignMessage({
        target: '_blank',
        signMessage: message,
        fromAddress: account,
      });
      return response.signature;
    },
    [user, connector],
  );

  const disconnect = React.useCallback(async () => {
    clearAuthStorage();
    dispatch(resetUser());
    window.location.reload();
  }, [connector, dispatch, user]);

  const onChangeAccount = React.useCallback((account: IAccount) => {
    const evmWalletAddress: string = account.tcAddress;
    dispatch(updateEVMWallet(evmWalletAddress));
    localStorage.setItem(TC_WALLET_ADDRESS, evmWalletAddress);
  }, []);

  const connect = React.useCallback(async () => {
    const response: any = await connector.requestAccount({
      target: '_blank',
      redirectURL: window.location.href,
      signMessage: '',
    });

    console.log('response', response);

    const addresses = response.accounts;

    if (addresses && Array.isArray(addresses)) {
      const evmWalletAddress: string = response.tcAddress;
      const taprootAddress: string = response.btcAddress;
      dispatch(updateEVMWallet(evmWalletAddress));
      dispatch(updateTaprootWallet(taprootAddress));
      dispatch(updateSelectedWallet({ wallet: ConnectionType.TC_NETWORK }));
      dispatch(addAccounts(addresses));
      localStorage.setItem(TC_WALLET_ADDRESS, evmWalletAddress);
      localStorage.setItem(TAPROOT_WALLET_ADDRESS, taprootAddress);
      localStorage.setItem(TC_ACCOUNTS, JSON.stringify(addresses));

      return evmWalletAddress;
    }
    return null;
  }, [dispatch, connector, provider]);

  useEffect(() => {
    if (user?.walletAddress && !user.walletAddressBtcTaproot) {
      const taprootAddress = bitcoinStorage.getUserTaprootAddress(
        user?.walletAddress,
      );
      if (!taprootAddress) return;
      dispatch(updateTaprootWallet(taprootAddress));
    }
  }, [user, dispatch]);

  useAsyncEffect(async () => {
    const tcWalletAddress = localStorage.getItem(TC_WALLET_ADDRESS);
    const taprootWalletAddress = localStorage.getItem(TAPROOT_WALLET_ADDRESS);
    const accounts = localStorage.getItem(TC_ACCOUNTS);
    dispatch(updateEVMWallet(tcWalletAddress));
    dispatch(updateTaprootWallet(taprootWalletAddress));
    dispatch(updateSelectedWallet({ wallet: ConnectionType.TC_NETWORK }));
    if (typeof accounts === 'string') {
      dispatch(addAccounts(JSON.parse(accounts)));
    }
  }, []);

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
      getSignature,
      onChangeAccount,
    };
  }, [disconnect, connect]);

  return (
    <WalletContext.Provider value={contextValues}>{children}</WalletContext.Provider>
  );
};
