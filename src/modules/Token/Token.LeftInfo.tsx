import HorizontalItem from '@/components/HorizontalItem';
import {IToken} from '@/interfaces/token';
import {formatCurrency} from '@/utils';
import {Box, Text} from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import TokenListPaired from './Token.ListPaired';

const TokenLeftInfo = ({ data }: { data: IToken }) => {
  const tokenVolume = data?.usdTotalVolume
    ? new BigNumber(data?.usdTotalVolume).toFixed()
    : 'n/a';
  const marketCap = data?.usdMarketCap
    ? new BigNumber(data?.usdMarketCap).toFixed()
    : 'n/a';
  return (
    <>
      <Box className="token-info dive-bottom">
        <Text className="title">Token info</Text>
        <Box mb={`16px`} />
        <HorizontalItem
          className="item-info"
          label="Max supply"
          value={`${formatCurrency(data?.totalSupply)}`}
        />
        <Box mb={`8px`} />
        <HorizontalItem
          className="item-info"
          label="Volume"
          value={`$${formatCurrency(tokenVolume)}`}
        />
        <Box mb={`8px`} />
        <HorizontalItem
          className="item-info"
          label="Market cap"
          value={`$${formatCurrency(marketCap)}`}
        />
      </Box>
      <TokenListPaired data={data} />
    </>
  );
};

export default TokenLeftInfo;
