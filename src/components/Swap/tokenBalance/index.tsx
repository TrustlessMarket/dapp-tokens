import useBalanceERC20Token from '@/hooks/contract-operations/token/useBalanceERC20Token';
import { IToken } from '@/interfaces/token';
import { compareString, formatCurrency } from '@/utils';
import { Skeleton, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useAppSelector } from '@/state/hooks';
import { selectPnftExchange } from '@/state/pnftExchange';

export interface ItemBalanceProps {
  token?: IToken | undefined;
  onBalanceChange?: (_amount: string | undefined) => void;
}

const TokenBalance = (props: ItemBalanceProps) => {
  const { token, onBalanceChange } = props;
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState('0');
  const { call: tokenBalance } = useBalanceERC20Token();
  const { account, provider, isActive } = useWeb3React();
  const needReload = useAppSelector(selectPnftExchange).needReload;

  useEffect(() => {
    if (token?.address && account && isActive) {
      fetchBalance();
    }
  }, [token?.address, account, provider, needReload]);

  const fetchBalance = async () => {
    try {
      setLoading(true);
      const [_tokenBalance] = await Promise.all([getTokenBalance(token)]);
      if (_tokenBalance) {
        setBalance(_tokenBalance);
      }

      onBalanceChange && onBalanceChange(_tokenBalance);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getTokenBalance = async (token: IToken | undefined) => {
    if (!token) {
      return;
    }
    if (compareString(token.address, '0x2fe8d5A64afFc1d703aECa8a566f5e9FaeE0C00')) {
      console.log('token', token);
    }
    try {
      const response = await tokenBalance({
        erc20TokenAddress: token.address,
      });
      return response;
    } catch (error) {
      console.log('error', error);
      throw error;
    }
  };

  return (
    <Skeleton isLoaded={!loading}>
      <Text>{formatCurrency(balance)}</Text>
    </Skeleton>
  );
};

export default TokenBalance;
