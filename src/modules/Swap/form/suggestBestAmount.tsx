/* eslint-disable @typescript-eslint/no-explicit-any */
import { IToken } from '@/interfaces/token';
import { getTokenRate } from '@/services/bitcoin';
import { convertWrappedToToken } from '@/utils';
import { Box, Text } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import s from './styles.module.scss';

const SuggestBestAmount = ({
  baseToken,
  quoteToken,
}: {
  baseToken: IToken | null;
  quoteToken: IToken | null;
}) => {
  const [marketRate, setMarketRate] = useState('0');

  const refPair = useRef('');
  const refLoopGetRate = useRef(0);

  useEffect(() => {
    if (baseToken?.address && quoteToken?.address) {
      refLoopGetRate.current = 0;
      fetchTokenRate(baseToken, quoteToken);
    }
  }, [baseToken?.address, quoteToken?.address]);

  const fetchTokenRate = async (_baseToken: IToken, _quoteToken: IToken) => {
    if (!_baseToken?.symbol || !_quoteToken?.symbol) {
      return null;
    }

    try {
      const rate: any = await getTokenRate(
        `${convertWrappedToToken(_baseToken?.symbol)}${convertWrappedToToken(
          _quoteToken?.symbol,
        )}`,
      );

      setMarketRate(rate);
      refPair.current = `${convertWrappedToToken(
        _baseToken?.symbol,
      )}${convertWrappedToToken(_quoteToken?.symbol)}`;
    } catch (error) {
      if (refLoopGetRate.current < 1) {
        fetchTokenRate(_quoteToken, _baseToken);
        setMarketRate('0');
        refLoopGetRate.current += 1;
      }
    }
  };

  if (!baseToken?.address || !quoteToken?.address || !Boolean(Number(marketRate))) {
    return null;
  }

  return (
    <>
      <Box mt={2} />
      <Box className={s.bestAmount}>
        <Text className={s.bestAmount__label}>Best Amount:</Text>
      </Box>
    </>
  );
};

export default SuggestBestAmount;
