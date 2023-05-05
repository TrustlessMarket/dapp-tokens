import Button from '@/components/Button';
import Table from '@/components/Table';
import Text from '@/components/Text';
import { IToken } from '@/interfaces/token';
import { getTokenRp } from '@/services/swap';
import { getIsAuthenticatedSelector } from '@/state/user/selector';
import { formatCurrency } from '@/utils';
import { decimalToExponential } from '@/utils/format';
import { debounce } from 'lodash';
import { useContext, useEffect, useState } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useSelector } from 'react-redux';
import ModalCreateToken from './ModalCreateToken';
import { StyledTokens, UploadFileContainer } from './Tokens.styled';
// import { useRouter } from 'next/router';
// import { ROUTE_PATH } from '@/constants/route-path';
import { ROUTE_PATH } from '@/constants/route-path';
import { WalletContext } from '@/contexts/wallet-context';
import { DEFAULT_BASE_TOKEN } from '@/modules/Swap/form';
import { showError } from '@/utils/toast';
import { Box, Flex } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import Link from 'next/link';
import { useRouter } from 'next/router';
//const EXPLORER_URL = TRUSTLESS_COMPUTER_CHAIN_INFO.explorers[0].url;
import BodyContainer from '@/components/Swap/bodyContainer';
import { AiOutlineCaretDown, AiOutlineCaretUp } from 'react-icons/ai';
import { FaChartLine } from 'react-icons/fa';

const LIMIT_PAGE = 500;
//const ALL_ONE_PAGE = 10000;

const Tokens = () => {
  const TABLE_HEADINGS = [
    'Token #',
    'Name',
    'Price',
    '24h %',
    '7d %',
    'Market Cap',
    'Volume',
    'Supply',
    '',
  ];
  /*'Price','24h %','Market Cap'*/

  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const isAuthenticated = useSelector(getIsAuthenticatedSelector);
  const { onDisconnect, onConnect, requestBtcAddress } = useContext(WalletContext);

  // const { data, error, isLoading } = useSWR(getApiKey(getTokens), getTokens);

  const [tokensList, setTokensList] = useState<IToken[]>([]);

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
      const res = await getTokenRp({ limit: LIMIT_PAGE, page: page });
      console.log(res.length);
      /* const res1 = await getTokenRp({ limit: ALL_ONE_PAGE, page: 1 });;

      for(let i = 0;i<res.length;i++)
      {
        for(let j = 0;j<res1.length;j++)
        {
          if(res[i].address==res1[j].address)
          {
            if( res1[j].volume!=0) {
              res[i].volume = res1[j].volume;
            }
            if( res1[j].price!=0) {
              res[i].price = res1[j].price;
            }
            if( res1[j].percent!=0) {
              res[i].percent = res1[j].percent;
            }
            if( res1[j].usd_price!=0) {
              res[i].usd_price = res1[j].usd_price;
            }
            if( res1[j].usd_volume!=0) {
              res[i].usd_volume = res1[j].usd_volume;
            }

            break;
          }
        }
      }
      for(let i = 0;i<res.length-1;i++)
      {
        for(let j = i+1;j<res.length;j++) {


          let isswap = false;
          if (!res[i].volume && res[j].volume) {
            isswap =true;
          }else if (res[i].volume && res[j].volume) {
            if(res[j].volume>res[i].volume) {
              isswap =true;
            }
          }
          if (isswap)
          {

            const temp = res[i];
            res[i] = res[j];
            res[j] = temp;
          }
        }}
      */

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
  }, []);

  const tokenDatas = tokensList.map((token) => {
    console.log('token', token);
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
        name: `${token?.name || '-'} (${token?.symbol || '-'})`,
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
        supply: formatCurrency(totalSupply.toString()),
        action: (
          <Box
            onClick={() =>
              router.push(`${ROUTE_PATH.TOKEN}?address=${token?.address}`)
            }
            aria-label={''}
          >
            <FaChartLine />
          </Box>
        ),
      },
      config: {
        onClick: () => {
          router.push(
            `${ROUTE_PATH.SWAP}?from_token=${DEFAULT_BASE_TOKEN}&to_token=${token?.address}`,
          );
        },
        style: {
          cursor: 'pointer',
        },
      },
    };
  });

  return (
    <BodyContainer>
      <StyledTokens>
        <div>
          <h3 className="upload_title">Smart BRC-20</h3>
        </div>
        <UploadFileContainer>
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
          <Table
            tableHead={TABLE_HEADINGS}
            data={tokenDatas}
            className={'token-table'}
          />
        </InfiniteScroll>
        <ModalCreateToken show={showModal} handleClose={() => setShowModal(false)} />
      </StyledTokens>
    </BodyContainer>
  );
};

export default Tokens;
