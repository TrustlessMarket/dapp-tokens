import { getIsAuthenticatedSelector, getUserSelector } from '@/state/user/selector';
import { getDefaultProvider } from '@/utils';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import * as TC_SDK from 'trustless-computer-sdk';
import useBitcoin from './useBitcoin';

const useTCWallet = (): {
  isAuthenticated: boolean;
  tcWalletAddress?: string;
  btcAddress?: string;
  tcBalance: string;
  btcBalance: string;
  loading: boolean;
} => {
  const isAuthenticated = useSelector(getIsAuthenticatedSelector);
  const user = useSelector(getUserSelector);

  const [tcBalance, setTCBalance] = useState('0');
  const [btcBalance, setBTCBalance] = useState('0');
  const [loading, setLoading] = useState(true);

  const provider = getDefaultProvider();

  const { tcClient } = useBitcoin();

  useEffect(() => {
    getData();
  }, [isAuthenticated, user?.walletAddress, user?.walletAddressBtcTaproot]);

  const getData = async () => {
    try {
      setLoading(true);
      await Promise.all([getTCBalance(), getBTCBalance()]);
    } catch (error) {
      // throw error;
    } finally {
      setLoading(false);
    }
  };

  const getTCBalance = async () => {
    if (!user?.walletAddress) {
      return;
    }
    try {
      const response = await provider.getBalance(user?.walletAddress);
      setTCBalance(response.toString());
    } catch (error) {
      throw error;
    }
  };

  const getBTCBalance = async () => {
    if (!user?.walletAddressBtcTaproot || !user?.walletAddress) {
      return;
    }
    try {
      const response = await TC_SDK.getUTXOs({
        btcAddress: user.walletAddressBtcTaproot,
        tcClient: tcClient,
        tcAddress: user.walletAddress,
      });
      setBTCBalance(response?.availableBalance?.toFixed());
    } catch (error) {
      throw error;
    }
  };

  return {
    isAuthenticated,
    tcWalletAddress: user?.walletAddress,
    btcAddress: user?.walletAddressBtcTaproot,
    tcBalance,
    btcBalance,
    loading,
  };
};

export default useTCWallet;
