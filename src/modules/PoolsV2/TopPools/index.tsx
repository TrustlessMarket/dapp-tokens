/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import {Box, Flex, Spinner, Text} from "@chakra-ui/react";
import InfiniteScroll from "react-infinite-scroll-component";
import ListTable from "@/components/Swap/listTable";
import React, {useContext, useEffect, useMemo, useState} from "react";
import {WalletContext} from "@/contexts/wallet-context";
import {IResourceChain} from "@/interfaces/chain";
import {formatCurrency} from "@/utils";
import {getListLiquidity} from "@/services/swap";
import {ILiquidity} from "@/interfaces/liquidity";
import {TRUSTLESS_MARKET_URL} from "@/configs";
import {ROUTE_PATH} from "@/constants/route-path";
import px2rem from "@/utils/px2rem";
import {debounce} from "lodash";
import {useWindowSize} from "@trustless-computer/dapp-core";
import styles from './styles.module.scss';
import {useWeb3React} from "@web3-react/core";
import TopPoolsPair from "@/modules/PoolsV2/TopPools/TopPools.Pair";
import TopPoolsItem from "@/modules/PoolsV2/TopPools/TopPools.Item";

const LIMIT_PAGE = 30;

const TopPools = () => {
  const [liquidityList, setLiquidityList] = useState<any[]>([]);
  const { getConnectedChainInfo } = useContext(WalletContext);
  const chainInfo: IResourceChain = getConnectedChainInfo();
  const [isFetching, setIsFetching] = useState(false);
  const { mobileScreen } = useWindowSize();
  const { account } = useWeb3React();

  useEffect(() => {
    fetchLiquidities();
  }, [chainInfo?.chain, account]);

  const fetchLiquidities = async (page = 1, isFetchMore = false) => {
    try {
      setIsFetching(true);
      const res = await getListLiquidity({ limit: LIMIT_PAGE, page: page, network: chainInfo?.chain?.toLowerCase(), address: account });
      if (isFetchMore) {
        setLiquidityList((prev) => [...prev, ...res]);
      } else {
        setLiquidityList(res);
      }
    } catch (err: unknown) {
      console.log(err);
      console.log('Failed to fetch tokens owned');
    } finally {
      setIsFetching(false);
    }
  };

  const shareTwitter = (row: ILiquidity) => {
    const shareUrl = `${TRUSTLESS_MARKET_URL}${ROUTE_PATH.POOLS_V2}`;
    const tokens = [];

    tokens.push(row?.token0Obj?.symbol);
    tokens.push(row?.token1Obj?.symbol);

    const content = `Great news! I have added liquidity to New Bitcoin DEX for ${tokens.join(
      ', ',
    )} token. Now you can easily trade ${tokens.join(
      ', ',
    )} on New Bitcoin DEX with ease and convenience.`;
    const hashtags = `NewBitcoinDEX,LiquidityProvider,TradeNow,${tokens.join(',')}`;
    window.open(
      `https://twitter.com/intent/tweet?url=${shareUrl}&text=${encodeURIComponent(
        content,
      )}&hashtags=${hashtags}`,
      '_blank',
    );
  };

  const columns = useMemo(() => {
    return [
      {
        id: 'pair',
        label: 'Pair',
        labelConfig: {
          fontSize: '12px',
          fontWeight: '500',
          color: '#B1B5C3',
          borderTopLeftRadius: '8px',
          borderBottomLeftRadius: '8px',
        },
        config: {
          color: '#FFFFFF',
          borderBottom: 'none',
          backgroundColor: '#1E1E22',
          borderTopLeftRadius: '8px',
          borderBottomLeftRadius: '8px',
        },
        render(row: ILiquidity) {
          return (
            <Flex fontSize={px2rem(14)} alignItems={'center'} gap={2}>
              <TopPoolsPair poolDetail={row}/>
            </Flex>
          );
        },
      },
      // {
      //   id: 'fee',
      //   label: 'Fee',
      //   labelConfig: {
      //     fontSize: '12px',
      //     fontWeight: '500',
      //     color: '#B1B5C3',
      //   },
      //   config: {
      //     color: '#FFFFFF',
      //     borderBottom: 'none',
      //     backgroundColor: '#1E1E22',
      //   },
      //   render(row: ILiquidity) {
      //     return (
      //       <Text fontSize={px2rem(14)} textAlign={'left'}>
      //         {new BigNumber(row?.fee || 0).div(10000).toString()}%
      //       </Text>
      //     );
      //   },
      // },
      {
        id: 'tvl',
        label: 'TVL',
        labelConfig: {
          fontSize: '12px',
          fontWeight: '500',
          color: '#B1B5C3',
        },
        config: {
          color: '#FFFFFF',
          borderBottom: 'none',
          backgroundColor: '#1E1E22',
        },
        render(row: ILiquidity) {
          return (
            <Text fontSize={px2rem(14)} textAlign={'left'}>
              ${formatCurrency(row?.liquidityUsd || 0, 2)}
            </Text>
          );
        },
      },
      {
        id: 'volume24h',
        label: 'Volume 24h',
        labelConfig: {
          fontSize: '12px',
          fontWeight: '500',
          color: '#B1B5C3',
        },
        config: {
          color: '#FFFFFF',
          borderBottom: 'none',
          backgroundColor: '#1E1E22',
        },
        render(row: ILiquidity) {
          return (
            <Text fontSize={px2rem(14)} textAlign={'left'}>
              ${formatCurrency(row?.usdVolume || 0, 2)}
            </Text>
          );
        },
      },
      {
        id: 'volume',
        label: 'Volume',
        labelConfig: {
          fontSize: '12px',
          fontWeight: '500',
          color: '#B1B5C3',
        },
        config: {
          color: '#FFFFFF',
          borderBottom: 'none',
          backgroundColor: '#1E1E22',
        },
        render(row: ILiquidity) {
          return (
            <Text fontSize={px2rem(14)} textAlign={'left'}>
              ${formatCurrency(row?.usdTotalVolume || 0, 2)}
            </Text>
          );
        },
      },
      {
        id: 'action',
        label: ' ',
        labelConfig: {
          fontSize: '12px',
          fontWeight: '500',
          color: '#B1B5C3',
        },
        config: {
          color: '#FFFFFF',
          borderBottom: 'none',
          backgroundColor: '#1E1E22',
        },
        render(row: ILiquidity) {
          return (
            <Text fontSize={px2rem(14)} textAlign={'left'}>
            </Text>
          );
        },
      },
    ];
  }, [mobileScreen, JSON.stringify(liquidityList)]);

  const onLoadMoreTokens = () => {
    if (isFetching || liquidityList.length % LIMIT_PAGE !== 0) return;
    const page = Math.floor(liquidityList.length / LIMIT_PAGE) + 1;
    fetchLiquidities(page, true);
  };

  const debounceLoadMore = debounce(onLoadMoreTokens, 300);

  return (
    <Box className={styles.container}>
      <InfiniteScroll
        className="tokens-list"
        dataLength={liquidityList?.length || 0}
        hasMore={true}
        loader={
          isFetching && (
            <Flex justifyContent={'center'} alignItems={'center'}>
              <Spinner speed="0.65s" emptyColor="gray.200" color="blue.500" />
            </Flex>
          )
        }
        next={debounceLoadMore}
      >
        <ListTable
          data={liquidityList}
          columns={columns}
          showEmpty={false}
          ItemListComponent={(row, extraData, columns, i) => {
            return (
              <TopPoolsItem poolDetail={row} columns={columns}/>
            );
         }}
        />
      </InfiniteScroll>
    </Box>
  );
};

export default TopPools;