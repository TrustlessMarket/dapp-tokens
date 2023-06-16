/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import Button from '@/components/Button';
import {IToken} from '@/interfaces/token';
import {getTokenRp} from '@/services/swap';
import {formatCurrency} from '@/utils';
import {debounce} from 'lodash';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {StyledTokens, UploadFileContainer} from './Tokens.styled';
import {ROUTE_PATH} from '@/constants/route-path';
import {Box, Flex, forwardRef, Icon, Spinner, Text} from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import Link from 'next/link';
import {useRouter} from 'next/router';
import BodyContainer from '@/components/Swap/bodyContainer';
import FieldText from '@/components/Swap/form/fieldText';
import ListTable, {ColumnProp} from '@/components/Swap/listTable';
import {CDN_URL} from '@/configs';
import {GM_ADDRESS, WBTC_ADDRESS, WETH_ADDRESS} from '@/constants/common';
import useDebounce from '@/hooks/useDebounce';
import px2rem from '@/utils/px2rem';
import {Field, Form, useFormState} from 'react-final-form';
import {AiOutlineCaretDown, AiOutlineCaretUp} from 'react-icons/ai';
import {VscArrowSwap} from 'react-icons/vsc';
import styles from './styles.module.scss';
import TokenChartLast7Day from './Token.ChartLast7Day';
import VerifiedBadgeToken from "./verifiedBadgeToken";
import {FiSearch} from 'react-icons/fi';

const LIMIT_PAGE = 100;

export const MakeFormSwap = forwardRef((props, ref) => {
  const router = useRouter();
  // const [showModal, setShowModal] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  // const isAuthenticated = useSelector(getIsAuthenticatedSelector);
  // const { onDisconnect, onConnect, requestBtcAddress } = useContext(WalletContext);
  const [tokensList, setTokensList] = useState<IToken[]>([]);
  const [sort, setSort] = useState({ sort: '' });
  const { values } = useFormState();

  // const handleConnectWallet = async () => {
  //   try {
  //     await onConnect();
  //     await requestBtcAddress();
  //   } catch (err) {
  //     showError({
  //       message: (err as Error).message,
  //     });
  //     console.log(err);
  //     onDisconnect();
  //   }
  // };

  const fetchTokens = async (page = 1, isFetchMore = false) => {
    try {
      setIsFetching(true);
      const sortField = sort?.sort?.replace('-', '');
      const sortType = sort?.sort?.includes('-') ? -1 : 1;
      const search = values?.search_text;
      const res =
        (await getTokenRp({
          limit: LIMIT_PAGE,
          page: page,
          sort: sortField,
          sort_type: sortType,
          search: search,
        })) || [];
      if (isFetchMore) {
        setTokensList((prev) => [...prev, ...res]);
      } else {
        setTokensList(res);
      }
    } catch (err: unknown) {
      console.log(err);
      console.log('Failed to fetch tokens owned');
    } finally {
      setIsFetching(false);
    }
  };

  const onLoadMoreTokens = () => {
    if (isFetching || tokensList.length % LIMIT_PAGE !== 0) return;
    const page = Math.floor(tokensList.length / LIMIT_PAGE) + 1;
    fetchTokens(page, true);
  };

  const debounceLoadMore = debounce(onLoadMoreTokens, 300);

  // const handleCreateToken = () => {
  //   if (!isAuthenticated) {
  //     handleConnectWallet();
  //     // router.push(ROUTE_PATH.CONNECT_WALLET);
  //   } else {
  //     setShowModal(true);
  //   }
  // };

  const debounced = useDebounce(values?.search_text);

  useEffect(() => {
    fetchTokens();
  }, [JSON.stringify(sort), debounced]);

  const columns: ColumnProp[] = useMemo(
    () => [
      /*{
        id: 'index',
        label: '#',
        labelConfig: {
          fontSize: '12px',
          fontWeight: '500',
          color: '#B1B5C3',
        },
        config: {
          // borderBottom: 'none',
        },
        onSort: () => {
          const sortField = 'index';
          setSort((_sort) => ({
            ..._sort,
            sort:
              !_sort?.sort?.includes(sortField) || _sort?.sort === sortField
                ? `-${sortField}`
                : sortField,
          }));
        },
        sort: sort?.sort,
        render(row: any) {
          return (
            <Text color={'#FFFFFF'} fontSize={px2rem(16)}>
              {row?.index}
            </Text>
          );
        },
      },*/
      {
        id: 'name',
        label: 'Name',
        labelConfig: {
          fontSize: '12px',
          fontWeight: '500',
          color: '#FFFFFF',
        },
        config: {
          // borderBottom: 'none',
        },
        onSort: () => {
          const sortField = 'name';
          setSort((_sort) => ({
            ..._sort,
            sort:
              !_sort?.sort?.includes(sortField) || _sort?.sort === sortField
                ? `-${sortField}`
                : sortField,
          }));
        },
        sort: sort?.sort,
        render(row: any) {
          return (
            <Flex gap={4} minW={px2rem(200)} alignItems={'center'}>
              <img
                // width={25}
                // height={25}
                src={
                  row?.thumbnail ||
                  `${CDN_URL}/upload/1683530065704444020-1683530065-default-coin.svg`
                }
                alt={row?.thumbnail || 'default-icon'}
                className={'avatar'}
              />
              <Flex direction={'column'} gap={1}>
                <Flex gap={1} alignItems={'center'} fontSize={px2rem(16)}>
                  <Box fontWeight={'500'} color={'#FFFFFF'}>
                    {row?.name}
                  </Box>
                  <Box color={'rgba(255, 255, 255, 0.7)'}>{row?.symbol}</Box>
                  <VerifiedBadgeToken token={row}/>
                </Flex>
                <Box fontSize={px2rem(12)} color={'rgba(255, 255, 255, 0.7)'}>
                  {row?.network || 'TC'}
                </Box>
              </Flex>
            </Flex>
          );
        },
      },
      {
        id: 'usd_price',
        label: 'Price',
        labelConfig: {
          fontSize: '12px',
          fontWeight: '500',
          color: '#FFFFFF',
        },
        config: {
          // borderBottom: 'none',
        },
        onSort: () => {
          const sortField = 'usd_price';
          setSort((_sort) => ({
            ..._sort,
            sort:
              !_sort?.sort?.includes(sortField) || _sort?.sort === sortField
                ? `-${sortField}`
                : sortField,
          }));
        },
        sort: sort?.sort,
        render(row: any) {
          const tokenPrice = row?.usdPrice
            ? new BigNumber(row?.usdPrice).toFixed()
            : 'n/a';
          return (
            <Text color={'#FFFFFF'} fontSize={px2rem(16)}>
              ${formatCurrency(tokenPrice, 10)}
            </Text>
          );
        },
      },
      {
        id: 'percent',
        label: '24h %',
        labelConfig: {
          fontSize: '12px',
          fontWeight: '500',
          color: '#FFFFFF',
        },
        config: {
          // borderBottom: 'none',
        },
        onSort: () => {
          const sortField = 'percent';
          setSort((_sort) => ({
            ..._sort,
            sort:
              !_sort?.sort?.includes(sortField) || _sort?.sort === sortField
                ? `-${sortField}`
                : sortField,
          }));
        },
        sort: sort?.sort,
        render(row: any) {
          return (
            <Flex
              alignItems={'center'}
              color={
                Number(row?.percent) > 0
                  ? '#16c784'
                  : Number(row?.percent) < 0
                  ? '#ea3943'
                  : '#FFFFFF'
              }
              fontSize={px2rem(16)}
            >
              {Number(row?.percent) > 0 && <AiOutlineCaretUp color={'#16c784'} />}
              {Number(row?.percent) < 0 && <AiOutlineCaretDown color={'#ea3943'} />}
              {formatCurrency(row?.percent, 2)}%
            </Flex>
          );
        },
      },
      // {
      //   id: 'percent_7day',
      //   label: '7d %',
      //   labelConfig: {
      //     fontSize: '12px',
      //     fontWeight: '500',
      //     color: '#FFFFFF',
      //   },
      //   config: {
      //     // borderBottom: 'none',
      //   },
      //   onSort: () => {
      //     const sortField = 'percent_7day';
      //     setSort((_sort) => ({
      //       ..._sort,
      //       sort: !_sort?.sort?.includes(sortField) || _sort?.sort === sortField ? `-${sortField}` : sortField,
      //     }));
      //   },
      //   sort: sort?.sort,
      //   render(row: any) {
      //     return (
      //       <Flex
      //         alignItems={'center'}
      //         color={Number(row?.percent7Day) > 0 ? '#16c784' : Number(row?.percent7Day) < 0 ? '#ea3943' : '#FFFFFF'}
      //         fontSize={px2rem(16)}
      //       >
      //         {Number(row?.percent7Day) > 0 && (
      //           <AiOutlineCaretUp color={'#16c784'} />
      //         )}
      //         {Number(row?.percent7Day) < 0 && (
      //           <AiOutlineCaretDown color={'#ea3943'} />
      //         )}
      //         {formatCurrency(row?.percent7Day, 2)}%
      //       </Flex>
      //     );
      //   },
      // },
      {
        id: 'market_cap',
        label: 'Market Cap',
        labelConfig: {
          fontSize: '12px',
          fontWeight: '500',
          color: '#FFFFFF',
        },
        config: {
          // borderBottom: 'none',
        },
        onSort: () => {
          const sortField = 'market_cap';
          setSort((_sort) => ({
            ..._sort,
            sort:
              !_sort?.sort?.includes(sortField) || _sort?.sort === sortField
                ? `-${sortField}`
                : sortField,
          }));
        },
        sort: sort?.sort,
        render(row: any) {
          return (
            <Text color={'#FFFFFF'} fontSize={px2rem(16)}>
              ${formatCurrency(row?.usdMarketCap, 2)}
            </Text>
          );
        },
      },
      {
        id: 'total_volume',
        label: 'Volume',
        labelConfig: {
          fontSize: '12px',
          fontWeight: '500',
          color: '#FFFFFF',
        },
        config: {
          // borderBottom: 'none',
        },
        // onSort: () => {
        //   const sortField = 'total_volume';
        //   setSort((_sort) => ({
        //     ..._sort,
        //     sort: !_sort?.sort?.includes(sortField) || _sort?.sort === sortField ? `-${sortField}` : sortField,
        //   }));
        // },
        // sort: sort?.sort,
        render(row: any) {
          const tokenVolume = row?.usdTotalVolume
            ? new BigNumber(row?.usdTotalVolume).toFixed()
            : 'n/a';
          return (
            <Text color={'#FFFFFF'} fontSize={px2rem(16)}>
              ${formatCurrency(tokenVolume, 2)}
            </Text>
          );
        },
      },
      {
        id: 'total_supply_number',
        label: 'Supply',
        labelConfig: {
          fontSize: '12px',
          fontWeight: '500',
          color: '#FFFFFF',
        },
        config: {
          // borderBottom: 'none',
        },
        onSort: () => {
          const sortField = 'total_supply_number';
          setSort((_sort) => ({
            ..._sort,
            sort:
              !_sort?.sort?.includes(sortField) || _sort?.sort === sortField
                ? `-${sortField}`
                : sortField,
          }));
        },
        sort: sort?.sort,
        render(row: any) {
          return (
            <Text color={'#FFFFFF'} fontSize={px2rem(16)}>
              {formatCurrency(row?.totalSupply, 0)}
            </Text>
          );
        },
      },
      {
        id: 'last7d',
        label: 'Last 7d',
        labelConfig: {
          fontSize: '12px',
          fontWeight: '500',
          color: '#FFFFFF',
        },
        config: {
          // borderBottom: 'none',
        },
        render(row: any) {
          return <TokenChartLast7Day token={row} />;
        },
      },
      {
        id: 'actions',
        label: 'Actions',
        labelConfig: {
          fontSize: '12px',
          fontWeight: '500',
          color: '#FFFFFF',
        },
        config: {
          // borderBottom: 'none',
        },
        render(row: any) {
          return (
            <Flex fontSize={px2rem(12)}>
              <Flex
                gap={3}
                alignItems={'center'}
                cursor={'pointer'}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  router.push(
                    `${ROUTE_PATH.SWAP}?from_token=${WBTC_ADDRESS}&to_token=${row?.address}`,
                  );
                }}
                title="Swap now"
                color={'#FFFFFF'}
                bg={'#1E1E22'}
                borderRadius={'100px'}
                paddingX={4}
                paddingY={2}
                _hover={{
                  color: '#1E1E22',
                  bg: '#FFFFFF',
                }}
                fontWeight={'medium'}
              >
                <Icon as={VscArrowSwap} fontWeight={'medium'} fontSize={'18px'} />
                Swap now
              </Flex>
            </Flex>
          );
        },
      },
    ],
    [sort.sort],
  );

  const handleItemClick = (token: any) => {
    router.push(`${ROUTE_PATH.TOKEN}?address=${token?.address}`);
  };

  return (
    <StyledTokens>
      <div className="max-content">
        <Flex
          justifyContent={"center"}
          alignItems={"center"}
          gap={2}
          mb={4}
          w={"fit-content"}
          marginX={"auto"}
          bg={"#1E1E22"}
          borderRadius={"100px"}
          paddingX={4}
          paddingY={2}
          fontSize={px2rem(16)}
          fontWeight={400}
        >
          <Text color={"#CECECE"}>Powered by</Text>
          <img
            height={20}
            src={`${CDN_URL}/icons/trussless-computer-logo.svg`}
            alt="logo"
          />
          <Text color={"#FFFFFF"}>Trustless Computer</Text>
        </Flex>
        <h3 className="upload_title">New Bitcoin DEX</h3>
      </div>
      <UploadFileContainer className="max-content">
        <div className="upload_left">
          {/* <img src={IcBitcoinCloud} alt="upload file icon" /> */}
          <div className="upload_content">
            {/* <h3 className="upload_title">BRC-20 on Bitcoin</h3> */}
            <Text className="upload_text" color={'rgba(255, 255, 255, 0.7)'}>
              Swap, earn, and build on <Text as={"span"} color={"#FFFFFF"}>the first decentralized crypto trading protocol on Bitcoin</Text>.
            </Text>
          </div>
        </div>
        <div className="upload_right">
          <Link
            href={`${ROUTE_PATH.SWAP}?from_token=${WETH_ADDRESS}&to_token=${GM_ADDRESS}`}
          >
            <Button className="comming-soon-btn" background={'#3385FF'}>
              <Text
                size="medium"
                color="#FFFFFF"
                className="brc20-text"
                fontWeight="medium"
              >
                Trade now
              </Text>
            </Button>
          </Link>
          <Link
            href={ROUTE_PATH.POOLS}
          >
            <Button
              className="button-create-box"
              background={'white'}
              // onClick={handleCreateToken}
            >
              <Text
                size="medium"
                color={'black'}
                className="button-text"
                fontWeight="medium"
              >
                Provide liquidity
              </Text>
            </Button>
          </Link>
        </div>
      </UploadFileContainer>
      <Flex mb={4} justifyContent={'flex-start'} mr={[0, 15]}>
        <Field
          component={FieldText}
          name="search_text"
          placeholder="Search name, symbol or token address"
          style={{
            textAlign: 'left',
          }}
          className={'search_text'}
          borderColor={'#353945'}
          // fieldChanged={onChange}
          prependComp={
            <FiSearch color={"rgba(255, 255, 255, 0.6)"} fontSize={"20px"}/>
          }
        />
      </Flex>
      <InfiniteScroll
        className="tokens-list"
        dataLength={tokensList?.length || 0}
        hasMore={true}
        loader={
          isFetching && (
            <Flex justifyContent={"center"} alignItems={"center"}>
              <Spinner
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
              />
            </Flex>
          )
        }
        next={debounceLoadMore}
      >
        <ListTable
          data={tokensList}
          columns={columns}
          onItemClick={handleItemClick}
          showEmpty={false}
        />
      </InfiniteScroll>
      {/*<ModalCreateToken show={showModal} handleClose={() => setShowModal(false)} />*/}
    </StyledTokens>
  );
});

const ListTokenForm = () => {
  const refForm = useRef<any>();

  const handleSubmit = async (values: any) => {};

  return (
    <BodyContainer className={styles.wrapper}>
      <Form onSubmit={handleSubmit} initialValues={{}}>
        {({ handleSubmit }) => (
          <MakeFormSwap ref={refForm} onSubmit={handleSubmit} />
        )}
      </Form>
    </BodyContainer>
  );
};

export default ListTokenForm;
