/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import {Box, Flex, Spinner, Text} from "@chakra-ui/react";
import InfiniteScroll from "react-infinite-scroll-component";
import ListTable from "@/components/Swap/listTable";
import React, {useContext, useEffect, useMemo, useState} from "react";
import {WalletContext} from "@/contexts/wallet-context";
import {IResourceChain} from "@/interfaces/chain";
import {compareString, formatCurrency, getTokenIconUrl} from "@/utils";
import {getListLiquidity} from "@/services/swap";
import {ILiquidity} from "@/interfaces/liquidity";
import {TRUSTLESS_MARKET_URL} from "@/configs";
import {ROUTE_PATH} from "@/constants/route-path";
import {USDC_ADDRESS, WBTC_ADDRESS, WETH_ADDRESS} from "@/constants/common";
import {IToken} from "@/interfaces/token";
import px2rem from "@/utils/px2rem";
import {debounce} from "lodash";
import {useWindowSize} from "@trustless-computer/dapp-core";
import {useRouter} from "next/router";
import styles from './styles.module.scss';
import BigNumber from "bignumber.js";

const LIMIT_PAGE = 30;

const TopPools = () => {
  const [liquidityList, setLiquidityList] = useState<any[]>([]);
  const { getConnectedChainInfo } = useContext(WalletContext);
  const chainInfo: IResourceChain = getConnectedChainInfo();
  const [isFetching, setIsFetching] = useState(false);
  const { mobileScreen } = useWindowSize();
  const router = useRouter();

  useEffect(() => {
    fetchLiquidities();
  }, [JSON.stringify(router.query)]);

  const fetchLiquidities = async (page = 1, isFetchMore = false) => {
    try {
      setIsFetching(true);
      const res = await getListLiquidity({ limit: LIMIT_PAGE, page: page, network: chainInfo.chain.toLowerCase() });
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

  const BASE_ADDRESS = [WBTC_ADDRESS, WETH_ADDRESS, USDC_ADDRESS];

  const sortTokens = (tokenA: IToken | undefined, tokenB: IToken | undefined) => {
    if (compareString(USDC_ADDRESS, tokenA?.address)) {
      return [tokenB, tokenA];
    } else if (compareString(USDC_ADDRESS, tokenB?.address)) {
      return [tokenA, tokenB];
    } else if (
      BASE_ADDRESS.some((address) => compareString(address, tokenA?.address))
    ) {
      return [tokenB, tokenA];
    } else if (
      BASE_ADDRESS.some((address) => compareString(address, tokenB?.address))
    ) {
      return [tokenA, tokenB];
    } else {
      return [tokenA, tokenB];
    }
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
          const [token0Obj, token1Obj] = sortTokens(row?.token0Obj, row?.token1Obj);

          return (
            <Flex fontSize={px2rem(14)} alignItems={'center'} gap={2}>
              <Flex gap={1} alignItems={'center'}>
                <img
                  src={getTokenIconUrl(token0Obj)}
                  alt={token0Obj?.thumbnail || 'default-icon'}
                  className={'avatar'}
                />
                <Text>{token0Obj?.symbol}</Text>
              </Flex>
              <Flex gap={1} alignItems={'center'}>
                <img
                  src={getTokenIconUrl(token1Obj)}
                  alt={token1Obj?.thumbnail || 'default-icon'}
                  className={'avatar'}
                />
                <Text>{token1Obj?.symbol}</Text>
              </Flex>
            </Flex>
          );
        },
      },
      {
        id: 'fee',
        label: 'Fee',
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
              {new BigNumber(row?.fee || 0).div(10000).toString()}%
            </Text>
          );
        },
      },
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
        <ListTable data={liquidityList} columns={columns} showEmpty={false} />
      </InfiniteScroll>
    </Box>
  );
};

export default TopPools;