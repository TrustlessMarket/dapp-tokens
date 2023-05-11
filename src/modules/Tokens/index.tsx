/* eslint-disable @typescript-eslint/no-unused-vars */
import Button from '@/components/Button';
import {IToken} from '@/interfaces/token';
import {getTokenRp} from '@/services/swap';
import {getIsAuthenticatedSelector} from '@/state/user/selector';
import {formatCurrency} from '@/utils';
import {decimalToExponential} from '@/utils/format';
import {debounce} from 'lodash';
import {useContext, useEffect, useMemo, useState} from 'react';
import Spinner from 'react-bootstrap/Spinner';
import InfiniteScroll from 'react-infinite-scroll-component';
import {useSelector} from 'react-redux';
import ModalCreateToken from './ModalCreateToken';
import {StyledTokens, UploadFileContainer} from './Tokens.styled';
// import { useRouter } from 'next/router';
// import { ROUTE_PATH } from '@/constants/route-path';
import {ROUTE_PATH} from '@/constants/route-path';
import {WalletContext} from '@/contexts/wallet-context';
import {WBTC_ADDRESS} from '@/modules/Swap/form';
import {showError} from '@/utils/toast';
import {Box, Flex, Text} from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import Link from 'next/link';
import {useRouter} from 'next/router';
//const EXPLORER_URL = TRUSTLESS_COMPUTER_CHAIN_INFO.explorers[0].url;
import BodyContainer from '@/components/Swap/bodyContainer';
import {AiOutlineCaretDown, AiOutlineCaretUp} from 'react-icons/ai';
import TokenChartLast7Day from './Token.ChartLast7Day';
import px2rem from '@/utils/px2rem';
import {FaChartBar} from 'react-icons/fa';
import ListTable, {ColumnProp} from '@/components/Swap/listTable';

const LIMIT_PAGE = 500;
//const ALL_ONE_PAGE = 10000;

const Tokens = () => {
  const TABLE_HEADINGS = [
    '#',
    'Name',
    'Price',
    '24h %',
    '7d %',
    'Market Cap',
    'Volume',
    'Supply',
    'Last 7d',
    'Actions',
  ];
  /*'Price','24h %','Market Cap'*/

  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const isAuthenticated = useSelector(getIsAuthenticatedSelector);
  const { onDisconnect, onConnect, requestBtcAddress } = useContext(WalletContext);
  const [tokensList, setTokensList] = useState<IToken[]>([]);
  const [sort, setSort] = useState({ sort: "-total_volume" });

  const handleConnectWallet = async () => {
    try {
      await onConnect();
      await requestBtcAddress();
    } catch (err) {
      showError({
        message: (err as Error).message,
      });
      console.log(err);
      onDisconnect();
    }
  };

  const fetchTokens = async (page = 1, isFetchMore = false) => {
    try {
      setIsFetching(true);
      const sortField = sort?.sort?.replace('-', '');
      const sortType = sort?.sort?.includes('-') ? -1 : 1;
      const res = await getTokenRp({ limit: LIMIT_PAGE, page: page, sort: sortField, sort_type: sortType });
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

  const handleCreateToken = () => {
    if (!isAuthenticated) {
      handleConnectWallet();
      // router.push(ROUTE_PATH.CONNECT_WALLET);
    } else {
      setShowModal(true);
    }
  };

  useEffect(() => {
    fetchTokens();
  }, [JSON.stringify(sort)]);

  const columns: ColumnProp[] = useMemo(
    () => [
      {
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
            sort: !_sort?.sort?.includes(sortField) || _sort?.sort === sortField ? `-${sortField}` : sortField,
          }));
        },
        sort: sort?.sort,
        render(row: any) {
          return <Text color={"#FFFFFF"}>{row?.index}</Text>;
        },
      },
      {
        id: 'name',
        label: 'Name',
        labelConfig: {
          fontSize: '12px',
          fontWeight: '500',
          color: '#B1B5C3',
        },
        config: {
          // borderBottom: 'none',
        },
        onSort: () => {
          const sortField = 'name';
          setSort((_sort) => ({
            ..._sort,
            sort: !_sort?.sort?.includes(sortField) || _sort?.sort === sortField ? `-${sortField}` : sortField,
          }));
        },
        sort: sort?.sort,
        render(row: any) {
          return (
            <Flex gap={2} minW={px2rem(200)} alignItems={'center'}>
              <img
                // width={25}
                // height={25}
                src={
                  row?.thumbnail ||
                  'https://cdn.trustless.computer/upload/1683530065704444020-1683530065-default-coin.svg'
                }
                alt={row?.thumbnail || 'default-icon'}
                className={'avatar'}
              />
              <Flex direction={'column'}>
                <Flex gap={1} alignItems={"flex-end"}>
                  <Box fontWeight={"500"} color={"#FFFFFF"}>{row?.name}</Box>
                  <Box fontSize={px2rem(16)} color={'rgba(255, 255, 255, 0.7)'}>
                    {row?.symbol}
                  </Box>
                </Flex>
                <Box fontSize={px2rem(14)} color={'rgba(255, 255, 255, 0.7)'}>
                  {row?.network || 'TC'}
                </Box>
              </Flex>
            </Flex>
          );
        },
      },
      {
        id: 'price',
        label: 'Price',
        labelConfig: {
          fontSize: '12px',
          fontWeight: '500',
          color: '#B1B5C3',
        },
        config: {
          // borderBottom: 'none',
        },
        onSort: () => {
          const sortField = 'usd_price';
          setSort((_sort) => ({
            ..._sort,
            sort: !_sort?.sort?.includes(sortField) || _sort?.sort === sortField ? `-${sortField}` : sortField,
          }));
        },
        sort: sort?.sort,
        render(row: any) {
          const tokenPrice = row?.usdPrice
            ? new BigNumber(row?.usdPrice).toFixed()
            : 'n/a';
          return <Text color={"#FFFFFF"}>${formatCurrency(tokenPrice, 10)}</Text>;
        },
      },
      {
        id: 'percent24h',
        label: '24h %',
        labelConfig: {
          fontSize: '12px',
          fontWeight: '500',
          color: '#B1B5C3',
        },
        config: {
          // borderBottom: 'none',
        },
        onSort: () => {
          const sortField = 'percent';
          setSort((_sort) => ({
            ..._sort,
            sort: !_sort?.sort?.includes(sortField) || _sort?.sort === sortField ? `-${sortField}` : sortField,
          }));
        },
        sort: sort?.sort,
        render(row: any) {
          return (
            <Flex
              alignItems={'center'}
              color={Number(row?.percent) > 0 ? '#16c784' : Number(row?.percent) < 0 ? '#ea3943' : '#FFFFFF'}
            >
              {Number(row?.percent) > 0 && <AiOutlineCaretUp color={'#16c784'} />}
              {Number(row?.percent) < 0 && (
                <AiOutlineCaretDown color={'#ea3943'} />
              )}
              {formatCurrency(row?.percent, 2)}%
            </Flex>
          );
        },
      },
      {
        id: 'percent7d',
        label: '7d %',
        labelConfig: {
          fontSize: '12px',
          fontWeight: '500',
          color: '#B1B5C3',
        },
        config: {
          // borderBottom: 'none',
        },
        onSort: () => {
          const sortField = 'percent_7day';
          setSort((_sort) => ({
            ..._sort,
            sort: !_sort?.sort?.includes(sortField) || _sort?.sort === sortField ? `-${sortField}` : sortField,
          }));
        },
        sort: sort?.sort,
        render(row: any) {
          return (
            <Flex
              alignItems={'center'}
              color={Number(row?.percent7Day) > 0 ? '#16c784' : Number(row?.percent7Day) < 0 ? '#ea3943' : '#FFFFFF'}
            >
              {Number(row?.percent7Day) > 0 && (
                <AiOutlineCaretUp color={'#16c784'} />
              )}
              {Number(row?.percent7Day) < 0 && (
                <AiOutlineCaretDown color={'#ea3943'} />
              )}
              {formatCurrency(row?.percent7Day, 2)}%
            </Flex>
          );
        },
      },
      {
        id: 'market_cap',
        label: 'Market Cap',
        labelConfig: {
          fontSize: '12px',
          fontWeight: '500',
          color: '#B1B5C3',
        },
        config: {
          // borderBottom: 'none',
        },
        render(row: any) {
          const totalSupply = new BigNumber(row?.totalSupply || 0).div(
            decimalToExponential(Number(row?.decimal || 18)),
          );
          const marketCap = row?.usdPrice
            ? new BigNumber(row?.usdPrice).multipliedBy(totalSupply).toFixed()
            : 'n/a';
          return <Text color={"#FFFFFF"}>${formatCurrency(marketCap, 2)}</Text>;
        },
      },
      {
        id: 'total_volume',
        label: 'Volume',
        labelConfig: {
          fontSize: '12px',
          fontWeight: '500',
          color: '#B1B5C3',
        },
        config: {
          // borderBottom: 'none',
        },
        onSort: () => {
          const sortField = 'total_volume';
          setSort((_sort) => ({
            ..._sort,
            sort: !_sort?.sort?.includes(sortField) || _sort?.sort === sortField ? `-${sortField}` : sortField,
          }));
        },
        sort: sort?.sort,
        render(row: any) {
          const tokenVolume = row?.usdTotalVolume
            ? new BigNumber(row?.usdTotalVolume).toFixed()
            : 'n/a';
          return <Text color={"#FFFFFF"}>${formatCurrency(tokenVolume, 2)}</Text>;
        },
      },
      {
        id: 'supply',
        label: 'Supply',
        labelConfig: {
          fontSize: '12px',
          fontWeight: '500',
          color: '#B1B5C3',
        },
        config: {
          // borderBottom: 'none',
        },
        onSort: () => {
          const sortField = 'total_supply';
          setSort((_sort) => ({
            ..._sort,
            sort: !_sort?.sort?.includes(sortField) || _sort?.sort === sortField ? `-${sortField}` : sortField,
          }));
        },
        sort: sort?.sort,
        render(row: any) {
          const totalSupply = new BigNumber(row?.totalSupply || 0).div(
            decimalToExponential(Number(row?.decimal || 18)),
          );
          return <Text color={"#FFFFFF"}>{formatCurrency(totalSupply.toString(), 0)}</Text>;
        },
      },
      {
        id: 'last7d',
        label: 'Last 7d',
        labelConfig: {
          fontSize: '12px',
          fontWeight: '500',
          color: '#B1B5C3',
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
          color: '#B1B5C3',
        },
        config: {
          // borderBottom: 'none',
        },
        render(row: any) {
          return (
            <Flex justifyContent={'center'} color={"#FFFFFF"}>
              <Box
                cursor={'pointer'}
                onClick={() =>
                  router.push(`${ROUTE_PATH.TOKEN}?address=${row?.address}`)
                }
                title="View detail"
              >
                <FaChartBar />
              </Box>
            </Flex>
          );
        },
      },
    ],
    [sort.sort],
  );

  const tokenDatas = tokensList.map((token) => {
    // if(compareString(token?.symbol, 'SLP')) {
    //   console.log('token', token);
    // }
    const totalSupply = new BigNumber(token?.totalSupply || 0).div(
      decimalToExponential(Number(token?.decimal || 18)),
    );
    const tokenPrice = token?.usdPrice
      ? new BigNumber(token?.usdPrice).toFixed()
      : 'n/a';
    const tokenVolume = token?.usdTotalVolume
      ? new BigNumber(token?.usdTotalVolume).toFixed()
      : 'n/a';
    const marketCap = token?.usdPrice
      ? new BigNumber(token?.usdPrice).multipliedBy(totalSupply).toFixed()
      : 'n/a';

    //const linkTokenExplorer = `${EXPLORER_URL}/token/${token?.address}`;
    //const linkToOwnerExplorer = `${EXPLORER_URL}/address/${token?.owner}`;

    return {
      id: `token-${token?.address}}`,
      render: {
        number: token?.index,
        name: (
          <Flex gap={2} minW={px2rem(200)} alignItems={'center'}>
            <img
              // width={25}
              // height={25}
              src={
                token?.thumbnail ||
                'https://cdn.trustless.computer/upload/1683530065704444020-1683530065-default-coin.svg'
              }
              alt={token?.thumbnail || 'default-icon'}
              className={'avatar'}
            />
            <Flex direction={'column'}>
              <Flex gap={1} alignItems={"flex-end"}>
                <Box fontWeight={"500"}>{token?.name}</Box>
                <Box fontSize={px2rem(16)} color={'rgba(255, 255, 255, 0.7)'}>
                  {token?.symbol}
                </Box>
              </Flex>
              <Box fontSize={px2rem(14)} color={'rgba(255, 255, 255, 0.7)'}>
                {token?.network || 'TC'}
              </Box>
            </Flex>
          </Flex>
        ),
        price: `$${formatCurrency(tokenPrice, 10)}`,
        percent:
          (
            <Flex
              alignItems={'center'}
              className={
                Number(token?.percent) > 0
                  ? 'increase'
                  : Number(token?.percent) < 0
                  ? 'descrease'
                  : ''
              }
            >
              {Number(token?.percent) > 0 && <AiOutlineCaretUp color={'#16c784'} />}
              {Number(token?.percent) < 0 && (
                <AiOutlineCaretDown color={'#ea3943'} />
              )}
              {formatCurrency(token?.percent, 2)}%
            </Flex>
          ) || 'n/a',
        percent7Day:
          (
            <Flex
              alignItems={'center'}
              className={
                Number(token?.percent7Day) > 0
                  ? 'increase'
                  : Number(token?.percent7Day) < 0
                  ? 'descrease'
                  : ''
              }
            >
              {Number(token?.percent7Day) > 0 && (
                <AiOutlineCaretUp color={'#16c784'} />
              )}
              {Number(token?.percent7Day) < 0 && (
                <AiOutlineCaretDown color={'#ea3943'} />
              )}
              {formatCurrency(token?.percent7Day, 2)}%
            </Flex>
          ) || 'n/a',
        usdVol: `$${formatCurrency(marketCap, 2)}`,
        usdVolume: <span>${formatCurrency(tokenVolume, 2)}</span>,
        supply: formatCurrency(totalSupply.toString(), 0),
        chart: <TokenChartLast7Day token={token} />,
        action: (
          <Flex justifyContent={'center'}>
            <Box
              cursor={'pointer'}
              onClick={() =>
                router.push(`${ROUTE_PATH.TOKEN}?address=${token?.address}`)
              }
              title="View detail"
            >
              <FaChartBar />
            </Box>
          </Flex>
        ),
      },
      config: {
        onClick: () => {
          router.push(
            `${ROUTE_PATH.SWAP}?from_token=${WBTC_ADDRESS}&to_token=${token?.address}`,
          );
        },
        style: {
          cursor: 'pointer',
        },
      },
    };
  });

  const handleItemClick = (token) => {
    router.push(
      `${ROUTE_PATH.SWAP}?from_token=${WBTC_ADDRESS}&to_token=${token?.address}`,
    );
  }

  return (
    <BodyContainer>
      <StyledTokens>
        <div className="max-content">
          <h3 className="upload_title">Smart BRC-20</h3>
        </div>
        <UploadFileContainer className="max-content">
          <div className="upload_left">
            {/* <img src={IcBitcoinCloud} alt="upload file icon" /> */}
            <div className="upload_content">
              {/* <h3 className="upload_title">BRC-20 on Bitcoin</h3> */}
              <Text className="upload_text">
                Smart BRC-20s are{' '}
                <span style={{ color: '#3385FF' }}>
                  the first smart contracts deployed on Bitcoin
                </span>
                . They run exactly as programmed without any possibility of fraud,
                third-party interference, or censorship. Issue your Smart BRC-20 on
                Bitcoin for virtually anything: a cryptocurrency, a share in a
                company, voting rights in a DAO, and more.
              </Text>
            </div>
          </div>
          <div className="upload_right">
            <Button
              className="button-create-box"
              background={'white'}
              onClick={handleCreateToken}
            >
              <Text
                size="medium"
                color={'black'}
                className="button-text"
                fontWeight="medium"
              >
                Issue Smart BRC-20
              </Text>
            </Button>
            <Link href={ROUTE_PATH.SWAP}>
              <Button
                className="comming-soon-btn"
                bg={'white'}
                background={'#3385FF'}
              >
                <Text
                  size="medium"
                  color="bg1"
                  className="brc20-text"
                  fontWeight="medium"
                >
                  Swap Smart BRC-20
                </Text>
              </Button>
            </Link>
          </div>
        </UploadFileContainer>
        <InfiniteScroll
          className="tokens-list"
          dataLength={tokensList?.length || 0}
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
          <ListTable data={tokensList} columns={columns} onItemClick={handleItemClick}/>
        </InfiniteScroll>
        <ModalCreateToken show={showModal} handleClose={() => setShowModal(false)} />
      </StyledTokens>
    </BodyContainer>
  );
};

export default Tokens;
