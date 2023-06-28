/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import {Box, Flex, Spinner, Text} from "@chakra-ui/react";
import InfiniteScroll from "react-infinite-scroll-component";
import ListTable from "@/components/Swap/listTable";
import React, {useContext, useEffect, useMemo, useState} from "react";
import {WalletContext} from "@/contexts/wallet-context";
import {IResourceChain} from "@/interfaces/chain";
import {compareString, getTokenIconUrl} from "@/utils";
import {getListUserPositions} from "@/services/swap";
import px2rem from "@/utils/px2rem";
import {debounce} from "lodash";
import {useWindowSize} from "@trustless-computer/dapp-core";
import styles from './styles.module.scss';
import {useWeb3React} from "@web3-react/core";
import {IPosition} from "@/interfaces/position";
import {USDC_ADDRESS, WBTC_ADDRESS, WETH_ADDRESS} from "@/constants/common";
import {IToken} from "@/interfaces/token";
import {tickToPrice} from "@/utils/number";
import BigNumber from "bignumber.js";
import InfoTooltip from "@/components/Swap/infoTooltip";
import cx from 'classnames';

const LIMIT_PAGE = 30;

const TopPools = () => {
  const [positionList, setPositionList] = useState<any[]>([]);
  const { getConnectedChainInfo } = useContext(WalletContext);
  const chainInfo: IResourceChain = getConnectedChainInfo();
  const [isFetching, setIsFetching] = useState(false);
  const { mobileScreen } = useWindowSize();
  const { account } = useWeb3React();

  useEffect(() => {
    if(account) {
      fetchLiquidities();
    }
  }, [account]);

  const fetchLiquidities = async () => {
    try {
      setIsFetching(true);
      const res = await getListUserPositions({ user_address: account, network: chainInfo.chain.toLowerCase() });
      setPositionList(res);
    } catch (err: unknown) {
      console.log(err);
      console.log('Failed to fetch tokens owned');
    } finally {
      setIsFetching(false);
    }
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
        render(row: IPosition) {
          const [token0Obj, token1Obj] = sortTokens(row?.pair?.token0Obj, row?.pair?.token1Obj);

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
        id: 'min_price',
        label: 'Min Price',
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
        render(row: IPosition) {
          console.log('row', row);
          return (
            <Flex direction={'column'} fontSize={px2rem(14)}>
              {tickToPrice(row?.tickLower || 0)}
            </Flex>
          );
        },
      },
      {
        id: 'max_price',
        label: 'Max Price',
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
        render(row: IPosition) {
          return (
            <Flex direction={'column'} fontSize={px2rem(14)}>
              {tickToPrice(row?.tickUpper || 0)}
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
        render(row: IPosition) {
          return (
            <Text fontSize={px2rem(14)} textAlign={'left'}>
              {new BigNumber(row?.pair?.fee || 0).div(10000).toString()}%
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
        render(row: IPosition) {
          const minPrice = tickToPrice(row?.tickLower || 0);
          const maxPrice = tickToPrice(row?.tickUpper || 0);
          const currentPrice = tickToPrice(row?.pair?.tick || 0);
          const inRange = minPrice <= currentPrice && currentPrice <= maxPrice;
          return (
            <Flex>
              <InfoTooltip
                showIcon={false}
                label={
                  inRange
                    ? 'The price of this pool is within your selected range. Your position is currently earning fees.'
                    : 'The price of this pool is not within your selected range. Your position is not currently earning fees.'
                }
              >
                <Text fontSize={px2rem(14)} textAlign={'left'} className={cx(styles.range, inRange ? styles.inRange : styles.outRange)}>
                  {inRange ? 'In Range' : 'Not In Range'}
                </Text>
              </InfoTooltip>
              {/**/}

            </Flex>

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
        render() {
          return (
            <Flex gap={4} justifyContent={'center'}>
            </Flex>
          );
        },
      },
    ];
  }, [mobileScreen, JSON.stringify(positionList)]);

  const onLoadMoreTokens = () => {
    if (isFetching || positionList.length % LIMIT_PAGE !== 0) return;
    fetchLiquidities();
  };

  const debounceLoadMore = debounce(onLoadMoreTokens, 300);

  return (
    <Box className={styles.container}>
      <InfiniteScroll
        className="tokens-list"
        dataLength={positionList?.length || 0}
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
        <ListTable data={positionList} columns={columns} showEmpty={false} />
      </InfiniteScroll>
    </Box>
  );
};

export default TopPools;