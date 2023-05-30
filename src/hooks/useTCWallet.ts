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
} => {
  const isAuthenticated = useSelector(getIsAuthenticatedSelector);
  const user = useSelector(getUserSelector);

  const [tcBalance, setTCBalance] = useState('0');
  const [btcBalance, setBTCBalance] = useState('0');

  const provider = getDefaultProvider();

  const { tcClient } = useBitcoin();

  useEffect(() => {
    getTCBalance();
    getBTCBalance();
  }, [isAuthenticated, user?.walletAddress, user?.walletAddressBtcTaproot]);

  const getTCBalance = async () => {
    if (!user?.walletAddress) {
      return;
    }
    try {
      const response = await provider.getBalance(user?.walletAddress);
      setTCBalance(response.toString());
    } catch (error) {}
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
      console.log('getBTCBalance', response);
      setBTCBalance(response?.availableBalance?.toFixed());
    } catch (error) {
      console.log('error', error);
    }
  };

  return {
    isAuthenticated,
    tcWalletAddress: user?.walletAddress,
    btcAddress: user?.walletAddressBtcTaproot,
    tcBalance,
    btcBalance,
  };
};

export default useTCWallet;
