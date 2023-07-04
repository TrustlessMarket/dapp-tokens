/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import BodyContainer from '@/components/Swap/bodyContainer';
import FiledButton from '@/components/Swap/button/filedButton';
import InfoTooltip from '@/components/Swap/infoTooltip';
import ListTable from '@/components/Swap/listTable';
import {
  DEFAULT_FROM_ADDRESS,
  DEFAULT_TO_ADDRESS,
  TRUSTLESS_MARKET_URL,
} from '@/configs';
import { USDC_ADDRESS, WBTC_ADDRESS, WETH_ADDRESS } from '@/constants/common';
import { ROUTE_PATH } from '@/constants/route-path';
import { IResourceChain } from '@/interfaces/chain';
import { ILiquidity } from '@/interfaces/liquidity';
import { IToken } from '@/interfaces/token';
import { getListLiquidity } from '@/services/swap';
import { useAppSelector } from '@/state/hooks';
import { selectPnftExchange } from '@/state/pnftExchange';
import { colors } from '@/theme/colors';
import {
  abbreviateNumber,
  camelCaseKeys,
  compareString,
  formatCurrency,
  getTokenIconUrl,
} from '@/utils';
import { formatAmountBigNumber } from '@/utils/format';
import px2rem from '@/utils/px2rem';
import {
  Box,
  Center,
  Flex,
  Heading,
  Icon,
  IconButton,
  Spinner,
  Tag,
  Text,
} from '@chakra-ui/react';
import { useWindowSize } from '@trustless-computer/dapp-core';
import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import { debounce } from 'lodash';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from 'react-icons/ai';
import { BsDownload, BsTwitter } from 'react-icons/bs';
import { FiPlus } from 'react-icons/fi';
import { IoArrowBackOutline } from 'react-icons/io5';
import { TbDiscount2 } from 'react-icons/tb';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useSelector } from 'react-redux';
import { StyledLiquidNote, StyledTokens, UploadFileContainer } from './Pools.styled';
import CreateMarket from './form';
import ImportPool, { getImportPoolKeyUser } from './form/importPool';
import styles from './styles.module.scss';

export enum ScreenType {
  default = 'default',
  add = 'create',
  add_liquid = 'add-liquidity',
  add_pool = 'add-pool',
  remove = 'remove',
}

const LIMIT_PAGE = 30;

export const DEFAULT_FROM_TOKEN_ADDRESS = DEFAULT_FROM_ADDRESS;
export const DEFAULT_TO_TOKEN_ADDRESS = DEFAULT_TO_ADDRESS;

const LiquidityContainer = () => {
  const [myLiquidities, setMyLiquidities] = useState([]);
  const [liquidityList, setLiquidityList] = useState<ILiquidity[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const { mobileScreen } = useWindowSize();
  const { account } = useWeb3React();
  const configs = useAppSelector(selectPnftExchange).configs;
  const liquidityFee = configs?.liquidityFee || 0.15;
  const currentSelectedChain: IResourceChain =
    useSelector(selectPnftExchange).currentChain;

  const router = useRouter();
  const routerQuery = router.query;

  useEffect(() => {
    renderScreen();
    if (
      (!routerQuery?.f || !routerQuery?.t) &&
      compareString(routerQuery.type, ScreenType.add_liquid)
    ) {
      router.replace(
        `${ROUTE_PATH.POOLS}?type=${ScreenType.add_liquid}&f=${DEFAULT_FROM_TOKEN_ADDRESS}&t=${DEFAULT_TO_TOKEN_ADDRESS}`,
      );
    }
  }, [routerQuery]);

  const fetchLiquidities = async (page = 1, isFetchMore = false) => {
    try {
      setIsFetching(true);
      const res = await getListLiquidity({
        limit: LIMIT_PAGE,
        page: page,
        network: currentSelectedChain.chain.toLowerCase(),
      });
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

  const onLoadMoreTokens = () => {
    if (isFetching || liquidityList.length % LIMIT_PAGE !== 0) return;
    const page = Math.floor(liquidityList.length / LIMIT_PAGE) + 1;
    fetchLiquidities(page, true);
  };

  const debounceLoadMore = debounce(onLoadMoreTokens, 300);

  const renderTitle = () => {
    switch (routerQuery.type) {
      case ScreenType.remove:
        return 'Remove Liquidity';
      case ScreenType.add_liquid:
        return 'Add Liquidity';
      case ScreenType.add_pool:
        return 'Import Pool';

      default:
        return 'Create a Pool';
    }
  };

  const renderScreen = () => {
    switch (routerQuery.type) {
      case ScreenType.add:
      case ScreenType.remove:
      case ScreenType.add_liquid:
        return (
          <>
            <Flex
              direction={'column'}
              justifyContent={'center'}
              alignItems={'center'}
              position={'relative'}
              w={['100', '70%']}
              marginX={'auto'}
            >
              <IconButton
                position={'absolute'}
                left={0}
                top={'6px'}
                size={'sm'}
                borderColor={'#FFFFFF'}
                borderWidth={1}
                colorScheme="whiteAlpha"
                isRound
                variant="outline"
                icon={<Icon as={IoArrowBackOutline} color={'#FFFFFF'} />}
                onClick={() =>
                  router.replace(`${ROUTE_PATH.POOLS}?type=${ScreenType.default}`)
                }
                aria-label={''}
              />
              <Heading as={'h6'}>{renderTitle()}</Heading>
            </Flex>
            <UploadFileContainer
              style={{
                width: mobileScreen ? '100%' : '70%',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              <div className="upload_left">
                <Box className={styles.wrapper}>
                  <Box>
                    <CreateMarket
                      type={routerQuery.type}
                      fromAddress={routerQuery?.f || DEFAULT_FROM_TOKEN_ADDRESS}
                      toAddress={routerQuery?.t || DEFAULT_TO_TOKEN_ADDRESS}
                    />
                  </Box>
                </Box>
              </div>
            </UploadFileContainer>
          </>
        );
      case ScreenType.add_pool:
        return (
          <>
            <Flex
              direction={'column'}
              justifyContent={'center'}
              alignItems={'center'}
              position={'relative'}
              w={['100', '70%']}
              marginX={'auto'}
            >
              <IconButton
                position={'absolute'}
                left={0}
                top={'6px'}
                size={'sm'}
                borderColor={'#FFFFFF'}
                borderWidth={1}
                colorScheme="whiteAlpha"
                isRound
                variant="outline"
                icon={<Icon as={IoArrowBackOutline} color={'#FFFFFF'} />}
                onClick={() =>
                  router.replace(`${ROUTE_PATH.POOLS}?type=${ScreenType.default}`)
                }
                aria-label={''}
              />
              <Heading as={'h6'}>{renderTitle()}</Heading>
            </Flex>
            <UploadFileContainer
              style={{
                width: mobileScreen ? '100%' : '70%',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              <div className="upload_left">
                <Box className={styles.wrapper}>
                  <Box>
                    <ImportPool />
                  </Box>
                </Box>
              </div>
            </UploadFileContainer>
          </>
        );

      default:
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
              <Flex gap={4} className="btn-wrap">
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
              </Flex>
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
            let myLiquidity = null;

            const token0Obj = row?.token0Obj;
            const token1Obj = row?.token1Obj;

            for (let index = 0; index < myLiquidities?.length; index++) {
              const l = myLiquidities[index] as IToken;
              if (
                (compareString(l?.fromAddress, token0Obj?.address) &&
                  compareString(l?.toAddress, token1Obj?.address)) ||
                (compareString(l?.fromAddress, token1Obj?.address) &&
                  compareString(l?.toAddress, token0Obj?.address))
              ) {
                myLiquidity = l;
                break;
              }
            }

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
          if (myLiquidity) {
            share = new BigNumber(myLiquidity?.ownerSupply || 0)
              .dividedBy(myLiquidity?.totalSupply || 1)
              .toNumber();
          }

          return (
            <Flex gap={4} justifyContent={'center'}>
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
          );
        },
      },
    ];
  }, [mobileScreen, JSON.stringify(liquidityList), JSON.stringify(myLiquidities)]);

  useEffect(() => {
    fetchMyLiquidities();
    fetchLiquidities();
  }, [JSON.stringify(router.query), currentSelectedChain?.chain, account]);

  const fetchMyLiquidities = async () => {
    try {
      let pairLiquid = localStorage.getItem(getImportPoolKeyUser(account));

      if (pairLiquid) {
        pairLiquid = JSON.parse(pairLiquid) || [];
        setMyLiquidities(camelCaseKeys(pairLiquid));
      }
    } catch (error) {}
  };

  return (
    <BodyContainer className={styles.containerWrapper}>
      <StyledTokens>
        <StyledLiquidNote>
          <Flex gap={4} alignItems={'flex-start'}>
            <Center
              w={'32px'}
              h={'32px'}
              minW={'32px'}
              minH={'32px'}
              borderRadius={'50%'}
              bgColor={'rgba(0, 170, 108, 0.2)'}
              cursor={'pointer'}
            >
              <TbDiscount2 color="#00AA6C" fontSize={'20px'} />
            </Center>
            <Flex direction={'column'}>
              <Text className="title">Liquidity provider rewards</Text>
              <Text className="desc">
                Liquidity providers earn a {liquidityFee}% fee on all trades
                proportional to their share of the pool. Fees are added to the pool,
                accrue in real time and can be claimed by withdrawing your liquidity.
              </Text>
            </Flex>
          </Flex>
        </StyledLiquidNote>
        {renderScreen()}
      </StyledTokens>
    </BodyContainer>
  );
};

export default LiquidityContainer;
