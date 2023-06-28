/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import {Box, Flex, Spinner, Text} from "@chakra-ui/react";
import InfiniteScroll from "react-infinite-scroll-component";
import ListTable from "@/components/Swap/listTable";
import React, {useContext, useEffect, useMemo, useState} from "react";
import {WalletContext} from "@/contexts/wallet-context";
import {IResourceChain} from "@/interfaces/chain";
import {formatCurrency} from "@/utils";
import {getListUserPositions} from "@/services/swap";
import {ILiquidity} from "@/interfaces/liquidity";
import px2rem from "@/utils/px2rem";
import {debounce} from "lodash";
import {useWindowSize} from "@trustless-computer/dapp-core";
import styles from './styles.module.scss';
import {useWeb3React} from "@web3-react/core";

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

  const columns = useMemo(() => {
    if (mobileScreen) {
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
          render() {
            return (
              <Flex gap={2} mt={4}>
              </Flex>
            );
          },
        },
        {
          id: 'volume',
          label: '',
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
          render() {
            return (
              <Flex gap={2} mt={4}>
              </Flex>
            );
          },
        },
      ];
    }

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
        render() {
          return (
            <Flex fontSize={px2rem(14)} alignItems={'center'} gap={2}>

            </Flex>
          );
        },
      },
      {
        id: 'your_liquidity',
        label: 'Your Liquidity',
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
        render() {
          return (
            <Flex direction={'column'} fontSize={px2rem(14)}>

            </Flex>
          );
        },
      },
      {
        id: 'total_liquidity',
        label: 'Total Liquidity',
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
        render() {
          return (
            <Flex direction={'column'} fontSize={px2rem(14)}>
            </Flex>
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
        id: 'apy',
        label: 'APY',
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
              {formatCurrency(row?.apr, 2)}%
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