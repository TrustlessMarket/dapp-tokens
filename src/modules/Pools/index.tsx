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
  Flex,
  Heading,
  Icon,
  IconButton,
  Text,
  Center
} from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import {useRouter} from 'next/router';
import {useEffect, useMemo, useState} from 'react';
import {FiPlus} from 'react-icons/fi';
import {IoArrowBackOutline} from 'react-icons/io5';
import {StyledLiquidNote, StyledTokens, UploadFileContainer} from './Pools.styled';
import CreateMarket from './form';
import ImportPool from './form/importPool';
import styles from './styles.module.scss';
import SectionContainer from "@/components/Swap/sectionContainer";
import Spinner from "react-bootstrap/Spinner";
import InfiniteScroll from "react-infinite-scroll-component";
import {debounce} from "lodash";
import {getListLiquidity} from "@/services/swap";
import {ILiquidity} from "@/interfaces/liquidity";
import {AiOutlineMinusCircle, AiOutlinePlusCircle} from "react-icons/ai";
import {BsTwitter} from "react-icons/bs";
import {TC_WEB_URL} from "@/configs";

export enum ScreenType {
  default = 'default',
  add = 'create',
  add_liquid = 'add-liquidity',
  add_pool = 'add-pool',
  remove = 'remove',
};

const LIMIT_PAGE = 30;

export const DEFAULT_FROM_TOKEN_ADDRESS =
  '0xfB83c18569fB43f1ABCbae09Baf7090bFFc8CBBD';
export const DEFAULT_TO_TOKEN_ADDRESS = '0xdd2863416081D0C10E57AaB4B3C5197183be4B34';

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
  const [liquidityList, setLiquidityList] = useState<any>([]);
  const [isFetching, setIsFetching] = useState(false);

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
            <UploadFileContainer>
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
            <UploadFileContainer>
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
                  style={{ borderColor: 'white', color: 'white' }}
                  _hover={{
                    backgroundColor: 'orange',
                  }}
                  variant={'outline'}
                  // onClick={() => handleChooseAction(true)}
                  fontSize={`${px2rem(16)} !important`}
                  onClick={() =>
                    router.replace(`${ROUTE_PATH.POOLS}?type=${ScreenType.add_pool}`)
                  }
                >
                  Import Pool
                </FiledButton>
                <FiledButton
                  style={{ background: 'orange' }}
                  // onClick={() => handleChooseAction(true)}
                  fontSize={`${px2rem(16)} !important`}
                  onClick={() =>
                    router.replace(
                      `${ROUTE_PATH.POOLS}?type=${ScreenType.add_liquid}&f=${DEFAULT_FROM_TOKEN_ADDRESS}&t=${DEFAULT_TO_TOKEN_ADDRESS}`,
                    )
                  }
                >
                  <FiPlus fontWeight={'bold'} fontSize={'20px'} />
                  Add liquidity
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
              <ListTable data={liquidityList} columns={columns} showEmpty={false}/>
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

  const shareTwitter = (shareUrl: string) => {
    const content = 'I have add liquidity on TC. Join with me';
    console.log('shareUrl', shareUrl);
    window.open(
      `https://twitter.com/intent/tweet?url=${shareUrl}&text=${encodeURIComponent(
        content
      )}`,
      "_blank"
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
        },
        config: {
          backgroundColor: '#FFFFFF',
          // borderBottom: 'none',
        },
        render(row: ILiquidity) {
          console.log('rowrowrow', row);
          return <Text fontSize={px2rem(14)}>{row?.token0Obj?.symbol} - {row?.token1Obj?.symbol}</Text>;
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
          backgroundColor: '#FFFFFF',
          // borderBottom: 'none',
        },
        render(row: ILiquidity) {
          let myLiquidity = null;

          for (let index = 0; index < myLiquidities?.length; index++) {
            const l = myLiquidities[index];
            if(compareString(l.fromAddress, row?.token0Obj?.address) && compareString(l.toAddress, row?.token1Obj?.address)) {
              myLiquidity = l;
              break;
            }
          }

          let share = 0;
          let fromBalance = 0;
          let toBalance = 0;
          if(myLiquidity) {
            share = new BigNumber(myLiquidity?.ownerSupply || 0)
              .dividedBy(myLiquidity?.totalSupply || 1);

            fromBalance = new BigNumber(share).multipliedBy(myLiquidity?.fromBalance);
            toBalance = new BigNumber(share).multipliedBy(myLiquidity?.toBalance);
          }

          return (
            <Flex direction={"column"} color={"#000000"} fontSize={px2rem(14)}>
              {
                Number(share) >= 0 ? (
                  <>
                    <Text>{row?.token0Obj?.symbol}: {formatCurrency(formatAmountBigNumber(fromBalance, myLiquidity?.decimal)).toString()}</Text>
                    <Text>{row?.token1Obj?.symbol}: {formatCurrency(formatAmountBigNumber(toBalance, myLiquidity?.decimal)).toString()}</Text>
                  </>
                ) : (
                  <Text>--</Text>
                )
              }
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
          backgroundColor: '#FFFFFF',
          // borderBottom: 'none',
        },
        render(row: ILiquidity) {
          return (
            <Flex direction={"column"} color={"#000000"} fontSize={px2rem(14)}>
              <Text>{row?.token0Obj?.symbol}: {formatCurrency(row?.reserve0,).toString()}</Text>
              <Text>{row?.token1Obj?.symbol}: {formatCurrency(row?.reserve1,).toString()}</Text>
            </Flex>
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
          backgroundColor: '#FFFFFF',
          // borderBottom: 'none',
        },
        render(row: ILiquidity) {
          return <Text fontSize={px2rem(14)} textAlign={"left"}>${formatCurrency(row?.usdVolume || 0, 2)}</Text>;
        },
      },
      {
        id: 'apr',
        label: 'APR',
        labelConfig: {
          fontSize: '12px',
          fontWeight: '500',
          color: '#B1B5C3',
        },
        config: {
          backgroundColor: '#FFFFFF',
          // borderBottom: 'none',
        },
        render(row: ILiquidity) {
          return <Text fontSize={px2rem(14)} textAlign={"left"}>{formatCurrency(row?.apr, 2)}%</Text>;
        },
      },
      {
        id: 'actions',
        label: ' ',
        labelConfig: {
          fontSize: '12px',
          fontWeight: '500',
          color: '#B1B5C3',
        },
        config: {
          backgroundColor: '#FFFFFF',
          // borderBottom: 'none',
        },
        render(row: ILiquidity) {
          let myLiquidity = null;

          for (let index = 0; index < myLiquidities?.length; index++) {
            const l = myLiquidities[index];
            if(compareString(l.fromAddress, row?.token0Obj?.address) && compareString(l.toAddress, row?.token1Obj?.address)) {
              myLiquidity = l;
              break;
            }
          }

          let share = 0;
          let fromBalance = 0;
          let toBalance = 0;
          if(myLiquidity) {
            share = new BigNumber(myLiquidity?.ownerSupply || 0)
              .dividedBy(myLiquidity?.totalSupply || 1);

            fromBalance = new BigNumber(share).multipliedBy(myLiquidity?.fromBalance);
            toBalance = new BigNumber(share).multipliedBy(myLiquidity?.toBalance);
          }

          return (
            <Flex gap={4} justifyContent={'center'}>
              <Center
                title={"Add Liquidity"}
                cursor={"pointer"}
                fontSize={"24px"}
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
              {
                Number(share) >= 0 && (
                  <Center
                    title={"Remove Liquidity"}
                    cursor={"pointer"}
                    fontSize={"24px"}
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
                )
              }
              <Center
                title={"Share Twitter"}
                cursor={"pointer"}
                fontSize={"24px"}
                _hover={{
                  color: '#33CCFF',
                }}
              >
                <BsTwitter
                  onClick={() =>
                    shareTwitter(`${TC_WEB_URL}${ROUTE_PATH.POOLS}?type=${ScreenType.add_liquid}&f=${row?.token0Obj?.address}&t=${row?.token1Obj?.address}`)
                }
                />
              </Center>
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
            <Text className="title">Liquidity provider rewards</Text>
            <Text className="desc">
              Liquidity providers earn a 1% fee on all trades proportional to their
              share of the pool. Fees are added to the pool, accrue in real time and
              can be claimed by withdrawing your liquidity.
            </Text>
          </StyledLiquidNote>
          {renderScreen()}
        </StyledTokens>
      </SectionContainer>
    </BodyContainer>
  );
};

export default LiquidityContainer;
