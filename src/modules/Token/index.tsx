/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import FiledButton from '@/components/Swap/button/filedButton';
import { ROUTE_PATH } from '@/constants/route-path';
import { camelCaseKeys } from '@/utils';
import {
  Box,
  Flex,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
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
import TokenLeftInfo from './Token.LeftInfo';
import TokenHistory from './Token.History';
import { colors } from '@/theme/colors';
import { WBTC_ADDRESS } from '../Swap/form';

const TokenChart = dynamic(() => import('./Token.Chart'), {
  ssr: false,
});

const TokenDetail = () => {
  const router = useRouter();
  const address: any = router.query?.address;
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState<IToken>();
  const [chartData, setChartData] = useState<any[]>([]);

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
          value: new BigNumber(v.btcPrice).toNumber(),
          time: Number(v.timestamp),
          open: new BigNumber(v.open).toNumber(),
          high: new BigNumber(v.high).toNumber(),
          close: new BigNumber(v.close).toNumber(),
          low: new BigNumber(v.low).toNumber(),
          volume: new BigNumber(v.totalVolume).toNumber(),
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
      <StyledTokenDetailContainer className="loading-container">
        <Spinner size={'lg'} color="#FFFFFF" style={{ margin: '0 auto' }} />
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
      <Flex width={'100%'} height={'100%'} flex={1}>
        <TokenLeftInfo data={data} />
        <Flex
          flexDirection={'column'}
          flex={4}
          style={{
            borderLeft: `1px solid ${colors.darkBorderColor}`,
          }}
        >
          <Box flex={2}>
            <TokenChart chartData={chartData} />
          </Box>
          <Box
            className="tab-container"
            // style={{
            //   borderTop: `1px solid ${colors.darkBorderColor}`,
            //   maxHeight: '300px',
            // }}
            flex={1}
          >
            <Tabs>
              <TabList>
                <Tab>Trade History</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <TokenHistory data={data} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </Flex>
      </Flex>
    </StyledTokenDetailContainer>
  );
};

export default TokenDetail;
