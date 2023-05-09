/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import FiledButton from '@/components/Swap/button/filedButton';
import { ROUTE_PATH } from '@/constants/route-path';
import { camelCaseKeys } from '@/utils';
import { Spinner, Text } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { StyledTokenDetailContainer } from './Token.styled';
// import TokenChart from './Token.Chart';
import { IToken } from '@/interfaces/token';
import { getChartToken, getTokenRp } from '@/services/swap';
import { useWeb3React } from '@web3-react/core';
import { sortBy } from 'lodash';
import dynamic from 'next/dynamic';
import TokenTopInfo from './Token.TopInfo';

const TokenChart = dynamic(() => import('./Token.Chart'), {
  ssr: false,
});

const TokenDetail = () => {
  const router = useRouter();
  const address: any = router.query?.address;
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState<IToken>();
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

      const _data = sortedData?.map((v: any) => {
        return {
          // ...v,
          value: new BigNumber(v.closeUsd).toNumber(),
          time: Number(v.timestamp),
          open: new BigNumber(v.openUsd).toNumber(),
          high: new BigNumber(v.highUsd).toNumber(),
          close: new BigNumber(v.closeUsd).toNumber(),
          low: new BigNumber(v.lowUsd).toNumber(),
          // volume: Number(v.volume || 0),
        };
      });

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
      <TokenTopInfo data={data} />
    </StyledTokenDetailContainer>
  );
};

export default TokenDetail;
