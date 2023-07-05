/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import FiledButton from '@/components/Swap/button/filedButton';
import {ROUTE_PATH} from '@/constants/route-path';
import {camelCaseKeys, compareString} from '@/utils';
import {Spinner, Tab, TabList, TabPanel, TabPanels, Tabs, Text, Tooltip,} from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';
import {
  StyledHistoryContentContainer,
  StyledLeftContentContainer,
  StyledTokenChartContainer,
  StyledTokenDetailContainer,
  StyledTokenTopInfo,
} from './Token.styled';
import {CDN_URL, L2_WBTC_ADDRESS} from '@/configs';
import {IToken} from '@/interfaces/token';
import {getChartToken, getTokenRp} from '@/services/swap';
import {sortBy} from 'lodash';
import dynamic from 'next/dynamic';
import TokenHistory from './Token.History';
import TokenLeftInfo from './Token.LeftInfo';
import TokenTopInfo from './Token.TopInfo';
import {useWeb3React} from '@web3-react/core';
import {useScreenLayout} from '@/hooks/useScreenLayout';
import {IResourceChain} from "@/interfaces/chain";
import {useSelector} from "react-redux";
import {selectPnftExchange} from "@/state/pnftExchange";
import {SupportedChainId} from "@/constants/chains";
import {WBTC_ADDRESS} from "@/constants/common";

const TokenChart = dynamic(() => import('./Token.Chart'), {
  ssr: false,
});

const TokenDetail = () => {
  const currentChain: IResourceChain = useSelector(selectPnftExchange).currentChain;
  const isL2 = compareString(currentChain?.chainId, SupportedChainId.L2);
  const router = useRouter();
  const address: any = router.query?.address;
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState<IToken>();
  const [chartData, setChartData] = useState<any[]>([]);

  const { headerHeight } = useScreenLayout();

  const { account, isActive } = useWeb3React();

  useEffect(() => {
    if (address) {
      getData();
    } else {
      const address: any = isL2 ? L2_WBTC_ADDRESS : WBTC_ADDRESS;
      router.replace(`${router.pathname}?address=${address}`);
    }
  }, [address, currentChain?.chain]);

  const getData = async () => {
    try {
      //   setLoading(true);
      if (!address) {
        throw 'Token not found';
      }
      const [resToken, resChart] = await Promise.all([
        getTokenRp({
          address,
          network: currentChain?.chain?.toLowerCase()
        }),
        getChartToken({
          contract_address: address,
          chart_type: 'minute',
          network: currentChain?.chain?.toLowerCase()
        }),
      ]);
      if (resToken.length === 0) {
        throw 'Token not found';
      }

      const sortedData = sortBy(resChart || [], 'timestamp');

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
      console.log('error >>>>>>>', error);
    } finally {
      setLoading(false);
    }
  };

  const topSpacing = headerHeight;

  if (loading) {
    return (
      <StyledTokenDetailContainer
        topSpacing={topSpacing}
        className="loading-container"
      >
        <Spinner size={'lg'} color="#FFFFFF" style={{ margin: '0 auto' }} />
      </StyledTokenDetailContainer>
    );
  }

  if (!data || !address) {
    return (
      <StyledTokenDetailContainer className="token-notfound-container">
        <div className="token-notfound">
          <img src={`${CDN_URL}/images/crying.svg`} alt="token-detail" />
          <Text>Opps.... Token not found</Text>
          <FiledButton onClick={() => router.replace(ROUTE_PATH.HOME)}>
            Go to Markets
          </FiledButton>
        </div>
      </StyledTokenDetailContainer>
    );
  }

  return (
    <StyledTokenDetailContainer topSpacing={topSpacing}>
      <StyledTokenTopInfo area={'topinfo'}>
        <TokenTopInfo data={data} />
      </StyledTokenTopInfo>
      <StyledLeftContentContainer area={'left'}>
        <TokenLeftInfo data={data} />
      </StyledLeftContentContainer>
      <StyledTokenChartContainer area={'chart'}>
        <TokenChart
          chartData={chartData}
          dataSymbol={data?.baseTokenSymbol || 'WBTC'}
        />
      </StyledTokenChartContainer>
      <StyledHistoryContentContainer className={'tab-container'} area={'history'}>
        <Tabs isLazy>
          <TabList>
            <Tab>Trade History</Tab>
            <Tab isDisabled={!Boolean(account && isActive)}>
              <Tooltip
                isDisabled={Boolean(account && isActive)}
                label="Connect your wallet to see your swaps"
              >
                My swaps
              </Tooltip>
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <TokenHistory data={data} />
            </TabPanel>
            {account && isActive && (
              <TabPanel>
                <TokenHistory data={data} isOwner={true} />
              </TabPanel>
            )}
          </TabPanels>
        </Tabs>
      </StyledHistoryContentContainer>
    </StyledTokenDetailContainer>
  );
};

export default TokenDetail;
