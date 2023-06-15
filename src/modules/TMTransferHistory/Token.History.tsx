/* eslint-disable @typescript-eslint/no-explicit-any */
import ListTable, {ColumnProp} from '@/components/Swap/listTable';
import {CDN_URL, TC_EXPLORER} from '@/configs';
import {getTMTransferHistory} from '@/services/swap';
import {compareString, formatCurrency} from '@/utils';
import {Flex, Text} from '@chakra-ui/react';
import moment from 'moment';
import {useEffect, useMemo, useState} from 'react';
import {RxExternalLink} from 'react-icons/rx';
import {useWeb3React} from "@web3-react/core";
import {debounce} from "lodash";
import Spinner from "react-bootstrap/Spinner";
import InfiniteScroll from "react-infinite-scroll-component";
import {colors} from "@/theme/colors";
import styles from './styles.module.scss';

const LIMIT_PAGE = 30;

const TokenHistory = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [list, setList] = useState<any[]>([]);
  const { account, } = useWeb3React();

  useEffect(() => {
    if(account) {
      getList();
    }
  }, [account]);

  const getList = async (page = 1, isFetchMore = false) => {
    try {
      setIsFetching(true);
      const res: any = await getTMTransferHistory({
        address: account as string,
        page: page,
        limit: LIMIT_PAGE,
      });

      if (isFetchMore) {
        setList((prev) => [...prev, ...res]);
      } else {
        setList(res);
      }
    } catch (error) {

    } finally {
      setIsFetching(false);
    }
  };

  const onLoadMoreTokens = () => {
    if (isFetching || list.length % LIMIT_PAGE !== 0) return;
    const page = Math.floor(list.length / LIMIT_PAGE) + 1;
    getList(page, true);
  };

  const debounceLoadMore = debounce(onLoadMoreTokens, 300);

  const columns: ColumnProp[] = useMemo(
    () => [
      {
        id: '#',
        label: '#',
        labelConfig: {
          fontSize: '12px',
          fontWeight: '500',
          color: '#B1B5C3',
        },
        config: {
          borderBottom: 'none',
        },
        render(row: any, extraData: any, index: any) {
          return <Text color={"#FFFFFF"}>{index + 1}</Text>;
        },
      },
      {
        id: 'token',
        label: 'Token',
        labelConfig: {
          fontSize: '12px',
          fontWeight: '500',
          color: '#B1B5C3',
        },
        config: {
          borderBottom: 'none',
        },
        render() {
          return (
            <Flex color={"#FFFFFF"} gap={1} alignItems={"center"}>
              <img
                width={20}
                height={20}
                src={`${CDN_URL}/icons/tm_icon.png`}
              />
              TM
            </Flex>
          );
        },
      },
      {
        id: 'type',
        label: 'Type',
        labelConfig: {
          fontSize: '12px',
          fontWeight: '500',
          color: '#B1B5C3',
        },
        config: {
          borderBottom: 'none',
        },
        render(row: any) {
          let type = 'Sent';
          let color = colors.redPrimary;

          if (compareString(row?.to, account)) {
            type = 'Received';
            color = colors.greenPrimary;
          }

          return <Text style={{ color }}>{type}</Text>;
        },
      },
      {
        id: 'date',
        label: 'Date',
        labelConfig: {
          fontSize: '12px',
          fontWeight: '500',
          color: '#B1B5C3',
        },
        config: {
          borderBottom: 'none',
        },
        render(row: any) {
          return <Text color={"#FFFFFF"}>{moment(row.createdAt).format('lll')}</Text>;
        },
      },
      {
        id: 'amount',
        label: 'Amount (TM)',
        labelConfig: {
          fontSize: '12px',
          fontWeight: '500',
          color: '#B1B5C3',
        },
        config: {
          borderBottom: 'none',
        },
        render(row: any) {
          return (
            <Text color={"#FFFFFF"}>
              {formatCurrency(row?.value, 18)}
            </Text>
          );
        },
      },
      {
        id: 'txLink',
        label: 'Tx Link',
        labelConfig: {
          fontSize: '12px',
          fontWeight: '500',
          color: '#B1B5C3',
        },
        config: {
          borderBottom: 'none',
        },
        render(row: any) {
          return (
            <Flex color={"#FFFFFF"}>
              <a
                title="explorer"
                href={`${TC_EXPLORER}/tx/${row.txHash}`}
                target="_blank"
              >
                <RxExternalLink />
              </a>
            </Flex>
          );
        },
      },
    ],
    [account],
  );

  return (
    <InfiniteScroll
      className={styles.tokensList}
      dataLength={list?.length || 0}
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
      <ListTable
        data={list}
        columns={columns}
        showEmpty={true}
        hideIcon={true}
        theme={'dark'}
      />
    </InfiniteScroll>
  );
};

export default TokenHistory;
