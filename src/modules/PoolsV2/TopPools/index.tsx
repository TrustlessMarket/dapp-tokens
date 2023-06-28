/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import {Box, Center, Flex, Spinner, Tag, Text} from "@chakra-ui/react";
import InfiniteScroll from "react-infinite-scroll-component";
import ListTable from "@/components/Swap/listTable";
import React, {useContext, useEffect, useMemo, useState} from "react";
import {WalletContext} from "@/contexts/wallet-context";
import {IResourceChain} from "@/interfaces/chain";
import {LIQUID_PAIRS} from "@/constants/storage-key";
import {abbreviateNumber, camelCaseKeys, compareString, formatCurrency, getTokenIconUrl} from "@/utils";
import {getListLiquidity} from "@/services/swap";
import {ILiquidity} from "@/interfaces/liquidity";
import {TRUSTLESS_MARKET_URL} from "@/configs";
import {ROUTE_PATH} from "@/constants/route-path";
import {ScreenType} from "@/modules/Pools";
import {USDC_ADDRESS, WBTC_ADDRESS, WETH_ADDRESS} from "@/constants/common";
import {IToken} from "@/interfaces/token";
import BigNumber from "bignumber.js";
import px2rem from "@/utils/px2rem";
import {colors} from "@/theme/colors";
import InfoTooltip from "@/components/Swap/infoTooltip";
import {AiOutlineMinusCircle, AiOutlinePlusCircle} from "react-icons/ai";
import {BsTwitter} from "react-icons/bs";
import {formatAmountBigNumber} from "@/utils/format";
import {debounce} from "lodash";
import {useWindowSize} from "@trustless-computer/dapp-core";
import {useRouter} from "next/router";
import styles from './styles.module.scss';

const LIMIT_PAGE = 30;

const TopPools = () => {
  const [myLiquidities, setMyLiquidities] = useState([]);
  const [liquidityList, setLiquidityList] = useState<any[]>([]);
  const { getConnectedChainInfo } = useContext(WalletContext);
  const chainInfo: IResourceChain = getConnectedChainInfo();
  const [isFetching, setIsFetching] = useState(false);
  const { mobileScreen } = useWindowSize();
  const router = useRouter();

  useEffect(() => {
    fetchMyLiquidities();
    fetchLiquidities();
  }, [JSON.stringify(router.query)]);

  const fetchMyLiquidities = async () => {
    try {
      let pairLiquid = localStorage.getItem(LIQUID_PAIRS);

      if (pairLiquid) {
        pairLiquid = JSON.parse(pairLiquid) || [];
        setMyLiquidities(camelCaseKeys(pairLiquid));
      }
    } catch (error) {}
  };

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
        id: 'actions',
        label: ' ',
        labelConfig: {
          fontSize: '12px',
          fontWeight: '500',
          color: '#B1B5C3',
          borderTopRightRadius: '8px',
          borderBottomRightRadius: '8px',
        },
        config: {
          color: '#FFFFFF',
          borderBottom: 'none',
          backgroundColor: '#1E1E22',
          borderTopRightRadius: '8px',
          borderBottomRightRadius: '8px',
        },
        render(row: ILiquidity) {
          let myLiquidity = null;

          for (let index = 0; index < myLiquidities?.length; index++) {
            const l = myLiquidities[index] as IToken;
            if (
              compareString(l.fromAddress, row?.token0Obj?.address) &&
              compareString(l.toAddress, row?.token1Obj?.address)
            ) {
              myLiquidity = l;
              break;
            }
          }

          let share = 0;
          let fromBalance = 0;
          let toBalance = 0;
          if (myLiquidity) {
            share = new BigNumber(myLiquidity?.ownerSupply || 0)
              .dividedBy(myLiquidity?.totalSupply || 1)
              .toNumber();

            fromBalance = new BigNumber(share)
              .multipliedBy(myLiquidity?.fromBalance || 0)
              .toNumber();
            toBalance = new BigNumber(share)
              .multipliedBy(myLiquidity?.toBalance || 0)
              .toNumber();
          }

          return (
            <Flex gap={4} justifyContent={'center'}>
              <InfoTooltip label={'Share Twitter'}>
                <Center
                  cursor={'pointer'}
                  fontSize={'24px'}
                  _hover={{
                    color: '#33CCFF',
                  }}
                >
                  <BsTwitter onClick={() => shareTwitter(row)} />
                </Center>
              </InfoTooltip>
            </Flex>
          );
        },
      },
    ];
  }, [mobileScreen, JSON.stringify(liquidityList), JSON.stringify(myLiquidities)]);

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