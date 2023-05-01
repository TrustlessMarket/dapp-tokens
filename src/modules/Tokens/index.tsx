import Button from '@/components/Button';
import Table from '@/components/Table';
import Text from '@/components/Text';
import { TRUSTLESS_COMPUTER_CHAIN_INFO } from '@/constants/chains';
import {getTokenRp, getTokens} from '@/services/token-explorer';
import { shortenAddress } from '@/utils';
import { decimalToExponential } from '@/utils/format';
import { debounce } from 'lodash';
import { useContext, useEffect, useState } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import InfiniteScroll from 'react-infinite-scroll-component';
import ModalCreateToken from './ModalCreateToken';
import { StyledTokens, UploadFileContainer } from './Tokens.styled';
import { IToken } from '@/interfaces/token';
import { useSelector } from 'react-redux';
import { getIsAuthenticatedSelector } from '@/state/user/selector';
// import { useRouter } from 'next/router';
// import { ROUTE_PATH } from '@/constants/route-path';
import { WalletContext } from '@/contexts/wallet-context';
import { showError } from '@/utils/toast';

const EXPLORER_URL = TRUSTLESS_COMPUTER_CHAIN_INFO.explorers[0].url;

const LIMIT_PAGE = 50;
const ALL_ONE_PAGE = 10000;

const Tokens = () => {
  const TABLE_HEADINGS = ['Token #','Name','Symbol',  'Supply', 'Creator'];
  /*'Price','24h %','Market Cap'*/

  // const router = useRouter();
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
      const res = await getTokens({ limit: LIMIT_PAGE, page: page });
      const res1 = await getTokenRp({ limit: ALL_ONE_PAGE, page: 1 });
      console.log("tuanabc");

      for(let i = 0;i<res.length;i++)
      {
        for(let j = 0;j<res1.length;j++)
        {
           if(res[i].address==res1[j].address)
           {
             res[i].volume = res1[j].volume;
             res[i].price = res1[j].price;
             res[i].percent = res1[j].percent;

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
    const totalSupply =
        parseInt(token?.totalSupply) / decimalToExponential(token.decimal);
    const linkTokenExplorer = `${EXPLORER_URL}/token/${token?.address}`;
    const linkToOwnerExplorer = `${EXPLORER_URL}/address/${token?.owner}`;

    return {
      id: `token-${token?.address}}`,
      render: {
        number: token?.index,
        name: (
            <a
                href={linkTokenExplorer}
                rel="rel=”noopener noreferrer”"
                target="_blank"
            >
              {token?.name || '-'}
            </a>
        ),

        symbol: token?.symbol || '-',
        /*
        price: token?.price || '-',
        change: token?.change || '-',
        cap: token?.cap || '-',
         */
        supply: totalSupply.toLocaleString(),
        creator: (
            <a
                href={linkToOwnerExplorer}
                rel="rel=”noopener noreferrer”"
                target="_blank"
            >
              {shortenAddress(token?.owner, 4) || '-'}
            </a>
        ),
      },
    };
  });

  return (
      <StyledTokens>
        <div className="background"></div>
        <div>
          <h3 className="upload_title">BRC-20 on Bitcoin</h3>
        </div>
        <UploadFileContainer>
          <div className="upload_left">
            {/* <img src={IcBitcoinCloud} alt="upload file icon" /> */}
            <div className="upload_content">
              {/* <h3 className="upload_title">BRC-20 on Bitcoin</h3> */}
              <Text size="medium" color="text1">
                BRC-20 is the standard for fungible tokens on Bitcoin. You can use it
                to represent virtually anything on Bitcoin: a cryptocurrency, a share
                in a company, voting rights in a DAO, an ounce of gold, and more.
              </Text>
            </div>
          </div>
          <div className="upload_right">
            <Button bg={'white'} background={'#3385FF'} onClick={handleCreateToken}>
              <Text
                  size="medium"
                  color="bg1"
                  className="button-text"
                  fontWeight="medium"
              >
                Create BRC-20
              </Text>
            </Button>
            <Button   className="comming-soon-btn"  bg={'white'} background={'gray'}  >
              <Text
                  size="medium"
                  color="bg1"
                  className="brc20-text"
                  fontWeight="medium"
              >
                Swap BRC-20
              </Text>

              <Text
                  size="small"
                  color="bg1"
                  className="comming-soon-text"
                  fontWeight="light"
              >
                coming soon
              </Text>
            </Button>
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
  );
};

export default Tokens;
