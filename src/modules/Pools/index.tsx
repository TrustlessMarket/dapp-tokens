/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import HorizontalItem from '@/components/Swap/horizontalItem';
import BodyContainer from '@/components/Swap/bodyContainer';
import FiledButton from '@/components/Swap/button/filedButton';
import ListTable from '@/components/Swap/listTable';
import {ROUTE_PATH} from '@/constants/route-path';
import {LIQUID_PAIRS} from '@/constants/storage-key';
import useGetReserves from '@/hooks/contract-operations/swap/useReserves';
import useSupplyERC20Liquid from '@/hooks/contract-operations/token/useSupplyERC20Liquid';
import {IToken} from '@/interfaces/token';
import {camelCaseKeys, compareString, formatCurrency} from '@/utils';
import {formatAmountBigNumber} from '@/utils/format';
import px2rem from '@/utils/px2rem';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Center,
  Flex,
  Heading,
  Icon,
  IconButton,
  Text,
} from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import {useRouter} from 'next/router';
import React, {useEffect, useMemo, useState} from 'react';
import {FiPlus} from 'react-icons/fi';
import {BsDownload, BsTwitter} from 'react-icons/bs';
import {IoArrowBackOutline} from 'react-icons/io5';
import {StyledLiquidNote, StyledTokens, UploadFileContainer} from './Pools.styled';
import CreateMarket from './form';
import ImportPool from './form/importPool';
import styles from './styles.module.scss';
import SectionContainer from '@/components/Swap/sectionContainer';
import Spinner from 'react-bootstrap/Spinner';
import InfiniteScroll from 'react-infinite-scroll-component';
import {debounce} from 'lodash';
import {getListLiquidity} from '@/services/swap';
import {ILiquidity} from '@/interfaces/liquidity';
import {AiOutlineMinusCircle, AiOutlinePlusCircle} from 'react-icons/ai';
import {CDN_URL, DEFAULT_FROM_ADDRESS, DEFAULT_TO_ADDRESS, TRUSTLESS_MARKET_URL,} from '@/configs';
import {USDC_ADDRESS, WBTC_ADDRESS, WETH_ADDRESS} from '@/constants/common';
import {useWindowSize} from '@trustless-computer/dapp-core';
import InfoTooltip from '@/components/Swap/infoTooltip';
import {TbDiscount2} from "react-icons/tb";
import {FEE} from "@/modules/Swap/form";

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

const ItemLiquid = ({ pool }: { pool: IToken }) => {
  const { call: getSupply } = useSupplyERC20Liquid();
  const { call: getReserves } = useGetReserves();
  const [result, setResult] = useState<any>({});
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await Promise.all([
        getSupply({
          liquidAddress: pool.address,
        }),
        getReserves({
          address: pool.address,
        }),
      ]);
      setResult({ ...response[0], ...response[1] });
    } catch (error) {}
  };

  return (
    <Accordion allowMultiple allowToggle>
      <AccordionItem>
        <h2>
          <AccordionButton>
            <Box as="span" flex="1" textAlign="left">
              {pool.name}
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel>
          <HorizontalItem
            label="Your pool total tokens:"
            value={pool?.ownerSupply?.toString()}
          />
          <HorizontalItem
            label={`Pooled ${pool.name.split('-')[0]}:`}
            value={formatCurrency(
              formatAmountBigNumber(pool?.fromBalance, pool.decimal),
            ).toString()}
          />
          <HorizontalItem
            label={`Pooled ${pool.name.split('-')[1]}:`}
            value={formatCurrency(
              formatAmountBigNumber(pool?.toBalance, pool.decimal),
            ).toString()}
          />
          <HorizontalItem
            label="Your pool share:"
            value={`${formatCurrency(
              new BigNumber(pool?.ownerSupply || 0)
                .dividedBy(pool?.totalSupply || 1)
                .multipliedBy(100)
                .toString(),
              2,
            ).toString()}%`}
          />
          <Flex gap={4} mt={4} justifyContent={'center'}>
            <FiledButton
              style={{
                backgroundColor: 'gray',
              }}
              btnSize="l"
              onClick={() =>
                router.replace(
                  `${ROUTE_PATH.POOLS}?type=${ScreenType.add_liquid}&f=${pool.fromAddress}&t=${pool.toAddress}`,
                )
              }
            >
              Add
            </FiledButton>
            <FiledButton
              btnSize="l"
              style={{
                backgroundColor: 'red',
              }}
              onClick={() =>
                router.replace(
                  `${ROUTE_PATH.POOLS}?type=${ScreenType.remove}&f=${pool.fromAddress}&t=${pool.toAddress}`,
                )
              }
            >
              Remove
            </FiledButton>
          </Flex>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

const LiquidityContainer = () => {
  const [myLiquidities, setMyLiquidities] = useState([]);
  const [liquidityList, setLiquidityList] = useState<ILiquidity[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const { mobileScreen } = useWindowSize();

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
      const res = await getListLiquidity({ limit: LIMIT_PAGE, page: page });
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
              // maxW={['auto', '70%']}
              marginX={'auto'}
              direction={['column', 'row']}
              mb={4}
            >
              <Heading as={'h6'}>Pools</Heading>
              <Flex gap={4}>
                {/* <FiledButton
                  style={{ borderColor: 'white', color: 'white' }}
                  _hover={{
                    backgroundColor: 'orange',
                  }}
                  variant={'outline'}
                  // onClick={() => handleChooseAction(true)}
                  fontSize={`${px2rem(16)} !important`}
                  onClick={() =>
                    router.replace(`${ROUTE_PATH.POOLS}?type=${ScreenType.add}`)
                  }
                >
                  Create a Pool
                </FiledButton> */}
                <FiledButton
                  border={"1px solid rgba(255, 255, 255, 0.1)"}
                  bgColor={"#0F0F0F !important"}
                  borderRadius={"100px !important"}
                  fontSize={`${px2rem(20)} !important`}
                  h={"52px !important"}
                  onClick={() =>
                    router.replace(`${ROUTE_PATH.POOLS}?type=${ScreenType.add_pool}`)
                  }
                >
                  <Flex gap={2} alignItems={"center"}>
                    <Center
                      w={'28px'}
                      h={'28px'}
                      minW={"28px"}
                      minH={"28px"}
                      borderRadius={'50%'}
                      bgColor={"rgba(255, 255, 255, 0.1)"}
                    >
                      <BsDownload fontWeight={'bold'} fontSize={'14px'}/>
                    </Center>
                    Import Pool
                  </Flex>
                </FiledButton>
                <FiledButton
                  bgColor={"#3385FF !important"}
                  borderRadius={"100px !important"}
                  fontSize={`${px2rem(20)} !important`}
                  h={"52px !important"}
                  onClick={() =>
                    router.replace(
                      `${ROUTE_PATH.POOLS}?type=${ScreenType.add_liquid}&f=${DEFAULT_FROM_TOKEN_ADDRESS}&t=${DEFAULT_TO_TOKEN_ADDRESS}`,
                    )
                  }
                >
                  <Flex gap={2} alignItems={"center"}>
                    <Center
                      w={'28px'}
                      h={'28px'}
                      minW={"28px"}
                      minH={"28px"}
                      borderRadius={'50%'}
                      bgColor={"#FFFFFF"}
                    >
                      <FiPlus fontWeight={'bold'} fontSize={'18px'} color={"#3385FF"}/>
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
                  <div className="loading">
                    <Spinner animation="border" variant="primary" />
                  </div>
                )
              }
              next={debounceLoadMore}
            >
              <ListTable data={liquidityList} columns={columns} showEmpty={false} />
            </InfiniteScroll>

            {/*<UploadFileContainer>
              <div className="upload_left">
                <Box className={styles.wrapper}>
                  <ListTable
                    data={data}
                    columns={columns}
                    noHeader
                    emptyLabel="Your active liquidity positions will appear here."
                  />
                </Box>
              </div>
            </UploadFileContainer>*/}
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

    // const isBaseToken0 = BASE_ADDRESS.some(address => compareString(address, row?.token0Obj?.address));
    // const isBaseToken1 = BASE_ADDRESS.some(address => compareString(address, row?.token1Obj?.address));
    //
    // if(!isBaseToken0) {
    //   tokens.push(row?.token0Obj?.symbol);
    // }
    //
    // if(!isBaseToken1) {
    //   tokens.push(row?.token1Obj?.symbol);
    // }

    tokens.push(row?.token0Obj?.symbol);
    tokens.push(row?.token1Obj?.symbol);

    const content = `Great news! I have added liquidity to New Bitcoin DEX for ${tokens.join(
      ', ',
    )} token. Now you can easily trade ${tokens.join(
      ', ',
    )} on New Bitcoin DEX with ease and convenience.`;
    const hashtags = `NewBitcoinDEX,LiquidityProvider,TradeNow,${tokens.join(
      ',',
    )}`;
    console.log('shareUrl', shareUrl);
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
          const [token0Obj, token1Obj] = sortTokens(row?.token0Obj, row?.token1Obj);

          return (
            <Flex fontSize={px2rem(14)} alignItems={'center'} gap={2}>
              <Flex gap={1} alignItems={'center'}>
                <img
                  src={
                    token0Obj?.thumbnail ||
                    `${CDN_URL}/upload/1683530065704444020-1683530065-default-coin.svg`
                  }
                  alt={token0Obj?.thumbnail || 'default-icon'}
                  className={'avatar'}
                />
                <Text>{token0Obj?.symbol}</Text>
              </Flex>
              <Flex gap={1} alignItems={'center'}>
                <img
                  src={
                    token1Obj?.thumbnail ||
                    `${CDN_URL}/upload/1683530065704444020-1683530065-default-coin.svg`
                  }
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
              compareString(l?.fromAddress, row?.token0Obj?.address) &&
              compareString(l?.toAddress, row?.token1Obj?.address)
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
                      src={
                        token0Obj?.thumbnail ||
                        `${CDN_URL}/upload/1683530065704444020-1683530065-default-coin.svg`
                      }
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
                      src={
                        token1Obj?.thumbnail ||
                        `${CDN_URL}/upload/1683530065704444020-1683530065-default-coin.svg`
                      }
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
                  src={
                    token0Obj?.thumbnail ||
                    `${CDN_URL}/upload/1683530065704444020-1683530065-default-coin.svg`
                  }
                  alt={token0Obj?.thumbnail || 'default-icon'}
                  className={'avatar2'}
                  title={token0Obj?.symbol}
                />
              </Flex>
              <Flex gap={1} alignItems={'center'}>
                <Text>{formatCurrency(reserve1).toString()}</Text>
                <img
                  src={
                    token1Obj?.thumbnail ||
                    `${CDN_URL}/upload/1683530065704444020-1683530065-default-coin.svg`
                  }
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
              {Number(share) >= 0 && (
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
      /*{
        id: 'rank',
        label: '',
        // labelConfig: {
        //   fontSize: '14px',
        //   fontWeight: '500',
        //   color: '#B1B5C3',
        // },
        config: {
          borderBottomWidth: '0',
        },
        render(row: IToken) {
          return <ItemLiquid pool={row} />;
        },
      },*/
    ];
  }, [JSON.stringify(liquidityList), JSON.stringify(myLiquidities)]);

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

  return (
    <BodyContainer className={styles.containerWrapper}>
      <SectionContainer>
        <StyledTokens>
          <StyledLiquidNote>
            <Flex gap={4} alignItems={"flex-start"}>
              <Center
                w={'32px'}
                h={'32px'}
                minW={"32px"}
                minH={"32px"}
                borderRadius={'50%'}
                bgColor={"rgba(0, 170, 108, 0.2)"}
                cursor={'pointer'}
              >
                <TbDiscount2 color="#00AA6C" fontSize={"20px"}/>
              </Center>
              <Flex direction={"column"}>
                <Text className="title">Liquidity provider rewards</Text>
                <Text className="desc">
                  Liquidity providers earn a {FEE/2}% fee on all trades proportional to their
                  share of the pool. Fees are added to the pool, accrue in real time and
                  can be claimed by withdrawing your liquidity.
                </Text>
              </Flex>
            </Flex>
          </StyledLiquidNote>
          {renderScreen()}
        </StyledTokens>
      </SectionContainer>
    </BodyContainer>
  );
};

export default LiquidityContainer;
