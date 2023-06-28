/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import BodyContainer from '@/components/Swap/bodyContainer';
import React, {useContext, useEffect, useMemo, useState} from 'react';
import s from './styles.module.scss';
import {Box, Center, Flex, Heading, Spinner, Tag, Text} from '@chakra-ui/react';
import FiledButton from '@/components/Swap/button/filedButton';
import {colors} from '@/theme/colors';
import Empty from '@/components/Empty';
import {useRouter} from 'next/router';
import {ROUTE_PATH} from '@/constants/route-path';
import {L2_ETH_ADDRESS, TRUSTLESS_MARKET_URL} from '@/configs';
import px2rem from "@/utils/px2rem";
import {BsTwitter} from "react-icons/bs";
import InfiniteScroll from "react-infinite-scroll-component";
import ListTable from "@/components/Swap/listTable";
import {ScreenType} from "@/modules/Pools";
import {useWindowSize} from "@trustless-computer/dapp-core";
import {LIQUID_PAIRS} from "@/constants/storage-key";
import {abbreviateNumber, camelCaseKeys, compareString, formatCurrency, getTokenIconUrl} from "@/utils";
import {getListLiquidity} from "@/services/swap";
import {ILiquidity} from "@/interfaces/liquidity";
import BigNumber from "bignumber.js";
import InfoTooltip from "@/components/Swap/infoTooltip";
import {AiOutlineMinusCircle, AiOutlinePlusCircle} from "react-icons/ai";
import {formatAmountBigNumber} from "@/utils/format";
import {IToken} from "@/interfaces/token";
import {USDC_ADDRESS, WBTC_ADDRESS, WETH_ADDRESS} from "@/constants/common";
import {debounce} from "lodash";
import {IResourceChain} from "@/interfaces/chain";
import {WalletContext} from "@/contexts/wallet-context";

const LIMIT_PAGE = 30;

const PoolsV2Page = () => {
  const [myLiquidities, setMyLiquidities] = useState([]);
  const [liquidityList, setLiquidityList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState(false);
  const { mobileScreen } = useWindowSize();
  const router = useRouter();
  const { getConnectedChainInfo } = useContext(WalletContext);
  const chainInfo: IResourceChain = getConnectedChainInfo();

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
    const shareUrl = `${TRUSTLESS_MARKET_URL}${ROUTE_PATH.POOLS}?type=${ScreenType.add_liquid}&f=${row?.token0Obj?.address}&t=${row?.token1Obj?.address}`;
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
          render(row: ILiquidity) {
            const [token0Obj, token1Obj] = sortTokens(
              row?.token0Obj,
              row?.token1Obj,
            );

            const myLiquidity: any = myLiquidities?.find((v: any) =>
              compareString(v.address, row?.pair),
            );

            let share = 0;
            if (myLiquidity) {
              share = new BigNumber(myLiquidity?.ownerSupply || 0)
                .dividedBy(myLiquidity?.totalSupply || 1)
                .toNumber();
            }

            return (
              <>
                <Flex fontSize={px2rem(14)} alignItems={'center'} gap={2}>
                  <Flex className="wrap-icons" alignItems={'center'}>
                    <img
                      src={getTokenIconUrl(token0Obj)}
                      alt={token0Obj?.thumbnail || 'default-icon'}
                      className={'avatar'}
                    />
                    <img
                      src={getTokenIconUrl(token1Obj)}
                      alt={token1Obj?.thumbnail || 'default-icon'}
                      className={'avatar'}
                    />
                  </Flex>
                  <Box>
                    <Text fontWeight={'500'}>
                      {token0Obj?.symbol} - {token1Obj?.symbol}
                    </Text>
                    <Text
                      fontSize={px2rem(12)}
                      color={colors.white}
                      opacity={0.8}
                      lineHeight={'16px'}
                    >
                      Vol: ${formatCurrency(row?.usdTotalVolume || 0, 2)}
                    </Text>
                    {Number(row?.apr) > 0 && (
                      <Tag mt={1} fontSize={px2rem(12)}>
                        APR:
                        <b style={{ marginLeft: 2 }}>
                          {formatCurrency(row?.apr, 2)}%
                        </b>
                      </Tag>
                    )}
                  </Box>
                </Flex>
                <Flex gap={2} mt={4}>
                  <InfoTooltip label={'Add Liquidity'}>
                    <Center
                      cursor={'pointer'}
                      fontSize={'24px'}
                      _hover={{
                        color: '#0072ff',
                      }}
                    >
                      <AiOutlinePlusCircle
                        onClick={() =>
                          router.replace(
                            `${ROUTE_PATH.POOLS}?type=${ScreenType.add_liquid}&f=${row?.token0Obj?.address}&t=${row?.token1Obj?.address}`,
                          )
                        }
                      />
                    </Center>
                  </InfoTooltip>
                  {Number(share) > 0 && (
                    <InfoTooltip label={'Remove Liquidity'}>
                      <Center
                        cursor={'pointer'}
                        fontSize={'24px'}
                        _hover={{
                          color: '#FF0000',
                        }}
                      >
                        <AiOutlineMinusCircle
                          onClick={() =>
                            router.replace(
                              `${ROUTE_PATH.POOLS}?type=${ScreenType.remove}&f=${row?.token0Obj?.address}&t=${row?.token1Obj?.address}`,
                            )
                          }
                        />
                      </Center>
                    </InfoTooltip>
                  )}
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
              </>
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
          render(row: ILiquidity) {
            const [token0Obj, token1Obj] = sortTokens(
              row?.token0Obj,
              row?.token1Obj,
            );
            const [reserve0, reserve1] = compareString(
              token0Obj?.address,
              row?.token0Obj?.address,
            )
              ? [row?.reserve0, row?.reserve1]
              : [row?.reserve1, row?.reserve0];

            const myLiquidity: any = myLiquidities.find((v: any) =>
              compareString(v.address, row?.pair),
            );

            let share = 0;
            let balances = [0, 0];
            if (myLiquidity) {
              share = new BigNumber(myLiquidity?.ownerSupply || 0)
                .dividedBy(myLiquidity?.totalSupply || 1)
                .toNumber();

              const fromBalance = new BigNumber(share)
                .multipliedBy(myLiquidity?.fromBalance || 0)
                .toNumber();
              const toBalance = new BigNumber(share)
                .multipliedBy(myLiquidity?.toBalance || 0)
                .toNumber();

              balances = compareString(myLiquidity?.fromAddress, token0Obj?.address)
                ? [fromBalance, toBalance]
                : [toBalance, fromBalance];
            }

            return (
              <>
                {Number(share) > 0 && (
                  <Flex
                    alignItems={'flex-end'}
                    direction={'column'}
                    fontSize={px2rem(14)}
                  >
                    <Text opacity={0.8} fontSize={px2rem(12)}>
                      Your liquidity:
                    </Text>
                    <Flex gap={1} alignItems={'center'}>
                      <Text>
                        {formatCurrency(
                          formatAmountBigNumber(balances[0], myLiquidity?.decimal),
                        ).toString()}
                      </Text>
                      <img
                        src={getTokenIconUrl(token0Obj)}
                        alt={token0Obj?.thumbnail || 'default-icon'}
                        className={'avatar2'}
                        title={token0Obj?.symbol}
                      />
                    </Flex>
                    <Flex gap={1} alignItems={'center'}>
                      <Text>
                        {formatCurrency(
                          formatAmountBigNumber(balances[1], myLiquidity?.decimal),
                        ).toString()}
                      </Text>
                      <img
                        src={getTokenIconUrl(token1Obj)}
                        alt={token1Obj?.thumbnail || 'default-icon'}
                        className={'avatar2'}
                        title={token1Obj?.symbol}
                      />
                    </Flex>
                  </Flex>
                )}

                <Flex
                  direction={'column'}
                  alignItems={'flex-end'}
                  justifyContent={'flex-end'}
                  fontSize={px2rem(14)}
                >
                  <Text opacity={0.8} fontSize={px2rem(12)}>
                    Total liquidity:
                  </Text>
                  <Flex gap={1} alignItems={'center'}>
                    <Text>{abbreviateNumber(reserve0).toString()}</Text>
                    <img
                      src={getTokenIconUrl(token0Obj)}
                      alt={token0Obj?.thumbnail || 'default-icon'}
                      className={'avatar2'}
                      title={token0Obj?.symbol}
                    />
                  </Flex>
                  <Flex gap={1} alignItems={'center'}>
                    <Text>{abbreviateNumber(reserve1).toString()}</Text>
                    <img
                      src={getTokenIconUrl(token1Obj)}
                      alt={token1Obj?.thumbnail || 'default-icon'}
                      className={'avatar2'}
                      title={token1Obj?.symbol}
                    />
                  </Flex>
                </Flex>
              </>
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
        render(row: ILiquidity) {
          const [token0Obj, token1Obj] = sortTokens(row?.token0Obj, row?.token1Obj);

          let myLiquidity = null;

          for (let index = 0; index < myLiquidities?.length; index++) {
            const l = myLiquidities[index] as IToken;
            if (
              (compareString(l?.fromAddress, row?.token0Obj?.address) &&
                compareString(l?.toAddress, row?.token1Obj?.address)) ||
              (compareString(l?.fromAddress, row?.token1Obj?.address) &&
                compareString(l?.toAddress, row?.token0Obj?.address))
            ) {
              myLiquidity = l;
              break;
            }
          }

          let share = 0;
          let balances = [0, 0];
          if (myLiquidity) {
            share = new BigNumber(myLiquidity?.ownerSupply || 0)
              .dividedBy(myLiquidity?.totalSupply || 1)
              .toNumber();

            const fromBalance = new BigNumber(share)
              .multipliedBy(myLiquidity?.fromBalance || 0)
              .toNumber();
            const toBalance = new BigNumber(share)
              .multipliedBy(myLiquidity?.toBalance || 0)
              .toNumber();

            balances = compareString(myLiquidity?.fromAddress, token0Obj?.address)
              ? [fromBalance, toBalance]
              : [toBalance, fromBalance];
          }

          return (
            <Flex direction={'column'} fontSize={px2rem(14)}>
              {Number(share) > 0 ? (
                <>
                  <Flex gap={1} alignItems={'center'}>
                    <Text>
                      {formatCurrency(
                        formatAmountBigNumber(balances[0], myLiquidity?.decimal),
                      ).toString()}
                    </Text>
                    <img
                      src={getTokenIconUrl(token0Obj)}
                      alt={token0Obj?.thumbnail || 'default-icon'}
                      className={'avatar2'}
                      title={token0Obj?.symbol}
                    />
                  </Flex>
                  <Flex gap={1} alignItems={'center'}>
                    <Text>
                      {formatCurrency(
                        formatAmountBigNumber(balances[1], myLiquidity?.decimal),
                      ).toString()}
                    </Text>
                    <img
                      src={getTokenIconUrl(token1Obj)}
                      alt={token1Obj?.thumbnail || 'default-icon'}
                      className={'avatar2'}
                      title={token1Obj?.symbol}
                    />
                  </Flex>
                </>
              ) : (
                <Text>--</Text>
              )}
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
        render(row: ILiquidity) {
          const [token0Obj, token1Obj] = sortTokens(row?.token0Obj, row?.token1Obj);
          const [reserve0, reserve1] = compareString(
            token0Obj?.address,
            row?.token0Obj?.address,
          )
            ? [row?.reserve0, row?.reserve1]
            : [row?.reserve1, row?.reserve0];

          return (
            <Flex direction={'column'} fontSize={px2rem(14)}>
              <Flex gap={1} alignItems={'center'}>
                <Text>{formatCurrency(reserve0).toString()}</Text>
                <img
                  src={getTokenIconUrl(token0Obj)}
                  alt={token0Obj?.thumbnail || 'default-icon'}
                  className={'avatar2'}
                  title={token0Obj?.symbol}
                />
              </Flex>
              <Flex gap={1} alignItems={'center'}>
                <Text>{formatCurrency(reserve1).toString()}</Text>
                <img
                  src={getTokenIconUrl(token1Obj)}
                  alt={token1Obj?.thumbnail || 'default-icon'}
                  className={'avatar2'}
                  title={token1Obj?.symbol}
                />
              </Flex>
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
              {/*<InfoTooltip label={'Add Liquidity'}>
                <Center
                  cursor={'pointer'}
                  fontSize={'24px'}
                  _hover={{
                    color: '#0072ff',
                  }}
                >
                  <AiOutlinePlusCircle
                    onClick={() =>
                      router.replace(
                        `${ROUTE_PATH.POOLS}?type=${ScreenType.add_liquid}&f=${row?.token0Obj?.address}&t=${row?.token1Obj?.address}`,
                      )
                    }
                  />
                </Center>
              </InfoTooltip>
              {Number(share) > 0 && (
                <InfoTooltip label={'Remove Liquidity'}>
                  <Center
                    cursor={'pointer'}
                    fontSize={'24px'}
                    _hover={{
                      color: '#FF0000',
                    }}
                  >
                    <AiOutlineMinusCircle
                      onClick={() =>
                        router.replace(
                          `${ROUTE_PATH.POOLS}?type=${ScreenType.remove}&f=${row?.token0Obj?.address}&t=${row?.token1Obj?.address}`,
                        )
                      }
                    />
                  </Center>
                </InfoTooltip>
              )}*/}
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

  const renderContent = () => {
    if (loading) {
      return <Spinner color={colors.white} />;
    }
    if (liquidityList.length === 0) {
      return (
        <>
          <Empty
            size={70}
            infoText="Your active V2 liquidity positions will appear here."
          />
        </>
      );
    }
    return (
      <>
        <Flex
          gap={4}
          alignItems={'center'}
          justifyContent={'space-between'}
          marginX={'auto'}
          direction={['column', 'row']}
          mb={4}
        >
          <Heading className="upload_title" as={'h3'} style={{ margin: 0 }}>
            Pools
          </Heading>
          {/*<Flex gap={4} className="btn-wrap">
            <FiledButton
              border={'1px solid rgba(255, 255, 255, 0.1)'}
              bgColor={'#0F0F0F !important'}
              borderRadius={'100px !important'}
              fontSize={[`${px2rem(16)} !important`, `${px2rem(20)} !important`]}
              btnSize="h"
              onClick={() =>
                router.replace(`${ROUTE_PATH.POOLS}?type=${ScreenType.add_pool}`)
              }
            >
              <Flex gap={2} alignItems={'center'}>
                <Center
                  w={'28px'}
                  h={'28px'}
                  minW={'28px'}
                  minH={'28px'}
                  borderRadius={'50%'}
                  bgColor={'rgba(255, 255, 255, 0.1)'}
                >
                  <BsDownload fontWeight={'bold'} fontSize={'14px'} />
                </Center>
                Import Pool
              </Flex>
            </FiledButton>
            <FiledButton
              bgColor={'#3385FF !important'}
              borderRadius={'100px !important'}
              fontSize={[`${px2rem(16)} !important`, `${px2rem(20)} !important`]}
              btnSize="h"
              onClick={() =>
                router.replace(
                  `${ROUTE_PATH.POOLS}?type=${ScreenType.add_liquid}&f=${DEFAULT_FROM_TOKEN_ADDRESS}&t=${DEFAULT_TO_TOKEN_ADDRESS}`,
                )
              }
            >
              <Flex gap={2} alignItems={'center'}>
                <Center
                  w={'28px'}
                  h={'28px'}
                  minW={'28px'}
                  minH={'28px'}
                  borderRadius={'50%'}
                  bgColor={'#FFFFFF'}
                >
                  <FiPlus
                    fontWeight={'bold'}
                    fontSize={'18px'}
                    color={'#3385FF'}
                  />
                </Center>
                Add liquidity
              </Flex>
            </FiledButton>
          </Flex>*/}
        </Flex>
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
      </>
    );
    return <></>;
  };

  return (
    <BodyContainer className={s.container}>
      <Flex className={s.container__header}>
        <Heading as={'h3'}>Pools</Heading>
        <Flex>
          <FiledButton
            onClick={() =>
              router.push(`${ROUTE_PATH.POOLS_V2_ADD}/${L2_ETH_ADDRESS}`)
            }
            btnSize="l"
          >
            + New Position
          </FiledButton>
        </Flex>
      </Flex>
      <Box mt={4} />
      {renderContent()}
      {/*<Flex
        className={cs(s.container__body, liquidityList.length === 0 && s.container__empty)}
      >
        {renderContent()}
      </Flex>*/}
    </BodyContainer>
  );
};

export default PoolsV2Page;
