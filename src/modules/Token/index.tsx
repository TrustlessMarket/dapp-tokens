/* eslint-disable @typescript-eslint/no-unused-vars */
import BodyContainer from '@/components/Swap/bodyContainer';
import FiledButton from '@/components/Swap/button/filedButton';
import {
  Box,
  Divider,
  Stat,
  StatHelpText,
  StatNumber,
  Text,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { StyledTokenDetailContainer } from './Token.styled';
import { ROUTE_PATH } from '@/constants/route-path';
import { formatAmountBigNumber, formatAmountSigning } from '@/utils/format';
import { formatCurrency } from '@/utils';
import useBalanceERC20Token from '@/hooks/contract-operations/token/useBalanceERC20Token';
import BigNumber from 'bignumber.js';

const TokenDetail = () => {
  const router = useRouter();
  const address = router.query?.addr;
  const [loading, setLoading] = useState(true);

  const { call: tokenBalance } = useBalanceERC20Token();

  const [data, setData] = useState({
    address: '0x6094d9CE6D4037116EB34A43B225073363EE8239',
    total_supply: '2015000000000000000000000000000',
    owner: '0x2b7841c71f2866E5E0c7E66f27cE6cdC0182dab8',
    decimal: 18,
    deployed_at_block: 0,
    slug: 'butt',
    symbol: 'BUTT',
    name: 'Butter In',
    thumbnail: '',
    description: '',
    social: {
      website: '',
      discord: '',
      twitter: '',
      telegram: '',
      medium: '',
      instagram: '',
    },
    index: 84,
    volume: '1.612119028296145585',
    total_volume: '4.071568261540495585',
    btc_volume: 1.6121190282961455,
    usd_volume: 46633.7671315226,
    btc_total_volume: 4.071568261540496,
    usd_total_volume: 117778.25510158193,
    price: '6.472455151E-12',
    btc_price: 6.472455151e-12,
    usd_price: 1.87228710152977e-7,
    percent: '0.13',
    percent_7day: '11649.55',
  });

  useEffect(() => {
    getData();
  }, [address]);

  const getData = async () => {
    try {
      setLoading(true);
      // const [] = await Promise.all([

      // ])
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <StyledTokenDetailContainer>
        <></>
      </StyledTokenDetailContainer>
    );
  }

  if (router.query && !address) {
    return (
      <StyledTokenDetailContainer className="token-notfound-container">
        <div className="token-notfound">
          <Text>Token not found</Text>
          <FiledButton onClick={() => router.replace(ROUTE_PATH.HOME)}>
            Go to Markets
          </FiledButton>
        </div>
      </StyledTokenDetailContainer>
    );
  }

  return (
    <StyledTokenDetailContainer>
      <Box style={{ textAlign: 'center' }}>
        <Text>{data.name}</Text>
        <Text>#{data.index}</Text>
        <Text>
          Supply:{' '}
          {formatCurrency(formatAmountBigNumber(data.total_supply, data.decimal))}
        </Text>
        <Text>Mint: 100%</Text>
      </Box>
      <Divider />
      <Box>
        <Stat style={{ textAlign: 'center' }}>
          <StatHelpText>Price:</StatHelpText>
          <StatNumber>${formatCurrency(data.usd_price, 10)}</StatNumber>
        </Stat>
        <Stat style={{ textAlign: 'center' }}>
          <StatHelpText>Market cap:</StatHelpText>
          <StatNumber>
            {formatCurrency(
              formatAmountBigNumber(
                new BigNumber(data?.usd_price)
                  .multipliedBy(data.total_supply)
                  .toFixed(),
                data.decimal,
              ),
            )}
          </StatNumber>
        </Stat>
        <Stat style={{ textAlign: 'center' }}>
          <StatHelpText>Volume:</StatHelpText>
          <StatNumber>${formatCurrency(data.usd_total_volume, 2)}</StatNumber>
        </Stat>
      </Box>
    </StyledTokenDetailContainer>
  );
};

export default TokenDetail;
