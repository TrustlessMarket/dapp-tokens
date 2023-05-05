/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import FiledButton from '@/components/Swap/button/filedButton';
import { ROUTE_PATH } from '@/constants/route-path';
import useBalanceERC20Token from '@/hooks/contract-operations/token/useBalanceERC20Token';
import { camelCaseKeys, compareString, formatCurrency } from '@/utils';
import { formatAmountBigNumber } from '@/utils/format';
import {
  Box,
  Divider,
  Flex,
  Spinner,
  Stat,
  StatHelpText,
  StatNumber,
  Text,
} from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { StyledTokenDetailContainer } from './Token.styled';
// import TokenChart from './Token.Chart';
import SocialToken from '@/components/Social';
import { getChartToken, getTokenRp } from '@/services/swap';
import { useWeb3React } from '@web3-react/core';
import { sortBy } from 'lodash';
import dynamic from 'next/dynamic';
import { DEFAULT_BASE_TOKEN } from '../Swap/form';

const TokenChart = dynamic(() => import('./Token.Chart'), {
  ssr: false,
});

const TokenDetail = () => {
  const router = useRouter();
  const address: any = router.query?.address;
  const [loading, setLoading] = useState(true);

  const { call: tokenBalance } = useBalanceERC20Token();

  const [data, setData] = useState<any>({});
  const [chartData, setChartData] = useState<any[]>([]);
  const { account } = useWeb3React();

  useEffect(() => {
    if (address) {
      getData();
    }
  }, [address]);

  const getData = async () => {
    try {
      //   setLoading(true);
      if (!address) {
        throw 'Token not found';
      }
      const [resToken, resChart] = await Promise.all([
        getTokenRp({
          address,
        }),
        getChartToken({
          contract_address: address,
          chart_type: 'hour',
        }),
      ]);
      if (resToken.length === 0) {
        throw 'Token not found';
      }

      const sortedData = sortBy(resChart, 'timestamp');

      const _data = sortedData?.map((v: any) => ({
        // ...v,
        value: Number(v.usd_price || '0'),
        time: Number(v.timestamp),
        open: Number(v.open),
        high: Number(v.high),
        close: Number(v.close),
        low: Number(v.low),
        // volume: Number(v.volume || 0),
      }));

      setChartData(_data);

      setData(camelCaseKeys(resToken[0]));
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <StyledTokenDetailContainer>
        <Spinner />
      </StyledTokenDetailContainer>
    );
  }

  if (!data || !address) {
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
        {data.thumbnail && <img src={data.thumbnail} alt="img" className="avatar" />}
        <Text>{data.name}</Text>
        <Text>#{data.index}</Text>
        <Text>
          Supply:{' '}
          {formatCurrency(formatAmountBigNumber(data.totalSupply, data.decimal))}
        </Text>
        <Flex justifyContent={'center'} gap={8} mt={6}>
          <FiledButton
            style={{}}
            onClick={() =>
              router.replace(
                `${ROUTE_PATH.SWAP}?from_token=${DEFAULT_BASE_TOKEN}&to_token=${data?.address}`,
              )
            }
          >
            Buy now
          </FiledButton>
          {compareString(data.owner, account) && (
            <FiledButton
              variant={'outline'}
              style={{
                backgroundColor: 'transparent',
                borderColor: 'gray',
              }}
              _hover={{
                color: '#000',
                opacity: 0.7,
              }}
              onClick={() =>
                router.replace(
                  `${ROUTE_PATH.UPDATE_TOKEN_INFO}?address=${data?.address}`,
                )
              }
            >
              Update token info
            </FiledButton>
          )}
        </Flex>
        <Flex mt={6} justifyContent={'center'}>
          <SocialToken socials={data.social} />
        </Flex>
      </Box>
      <Divider />
      <Box>
        <Stat style={{ textAlign: 'center' }}>
          <StatHelpText>Price:</StatHelpText>
          <StatNumber>${formatCurrency(data.usdPrice, 10)}</StatNumber>
        </Stat>
        <Stat style={{ textAlign: 'center' }}>
          <StatHelpText>Market cap:</StatHelpText>
          <StatNumber>
            {formatCurrency(
              formatAmountBigNumber(
                new BigNumber(data?.usdPrice)
                  .multipliedBy(data.totalSupply)
                  .toFixed(),
                data.decimal,
              ),
            )}
          </StatNumber>
        </Stat>
        <Stat style={{ textAlign: 'center' }}>
          <StatHelpText>Volume:</StatHelpText>
          <StatNumber>${formatCurrency(data.usdTotalVolume, 2)}</StatNumber>
        </Stat>
      </Box>
      {/* <Text>Chart Price</Text> */}
      <Box
        style={{
          height: 300,
          width: 600,
          position: 'relative',
        }}
      >
        <TokenChart chartData={chartData} />
      </Box>
    </StyledTokenDetailContainer>
  );
};

export default TokenDetail;
