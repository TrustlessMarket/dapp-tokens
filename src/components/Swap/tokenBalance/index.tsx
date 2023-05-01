import useBalanceERC20Token from '@/hooks/contract-operations/token/useBalanceERC20Token';
import { IToken } from '@/interfaces/token';
import { formatCurrency } from '@/utils';
import { Skeleton, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

export interface ItemBalanceProps {
  token?: IToken | undefined;
  onBalanceChange?: (_amount: string) => void;
}

const TokenBalance = (props: ItemBalanceProps) => {
  const { token, onBalanceChange } = props;
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState('0');
  const { call: tokenBalance } = useBalanceERC20Token();

  useEffect(() => {
    if (token?.address) {
      fetchBalance();
    }
  }, [token?.address]);

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
      <Text>
        {formatCurrency(balance)}
      </Text>
    </Skeleton>
  );
};

export default TokenBalance;
