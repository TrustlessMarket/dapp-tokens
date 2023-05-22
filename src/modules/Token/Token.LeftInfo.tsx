import HorizontalItem from '@/components/HorizontalItem';
import { IToken } from '@/interfaces/token';
import { formatCurrency } from '@/utils';
import { decimalToExponential } from '@/utils/format';
import { Box, Text } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import TokenListPaired from './Token.ListPaired';

const TokenLeftInfo = ({ data }: { data: IToken }) => {
  const totalSupply = new BigNumber(data?.totalSupply || 0).div(
    decimalToExponential(Number(data?.decimal || 18)),
  );
  const tokenVolume = data?.usdTotalVolume
    ? new BigNumber(data?.usdTotalVolume).toFixed()
    : 'n/a';
  const marketCap = data?.usdPrice
    ? new BigNumber(data?.usdPrice).multipliedBy(totalSupply).toFixed()
    : 'n/a';
  return (
    <>
      <Box className="token-info dive-bottom">
        <Text className="title">Token info</Text>
        <HorizontalItem
          className="item-info"
          label="Max supply"
          value={`${formatCurrency(totalSupply.toString())}`}
        />
        <HorizontalItem
          className="item-info"
          label="Volume"
          value={`$${formatCurrency(tokenVolume)}`}
        />
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
