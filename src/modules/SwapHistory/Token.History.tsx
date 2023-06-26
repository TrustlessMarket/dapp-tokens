/* eslint-disable @typescript-eslint/no-explicit-any */
import ListTable, {ColumnProp} from '@/components/Swap/listTable';
import {MEMPOOL_URL, TC_EXPLORER, WALLET_URL} from '@/configs';
import {getUserTradeHistory} from '@/services/swap';
import {camelCaseKeys, formatCurrency, formatLongAddress} from '@/utils';
import {Flex, Text} from '@chakra-ui/react';
import moment from 'moment';
import {useContext, useEffect, useMemo, useState} from 'react';
import {useWeb3React} from "@web3-react/core";
import usePendingSwapTransactions from "@/hooks/contract-operations/swap/usePendingSwapTransactions";
import {IResourceChain} from "@/interfaces/chain";
import {WalletContext} from "@/contexts/wallet-context";

const TokenHistory = () => {
  const [list, setList] = useState<any[]>([]);
  const [listPending, setListPending] = useState<any[]>([]);
  const { account } = useWeb3React();
  const { getConnectedChainInfo } = useContext(WalletContext);
  const chainInfo: IResourceChain = getConnectedChainInfo();
  const { call: getPendingSwapTransactions } = usePendingSwapTransactions();

  console.log('chainInfo', chainInfo);

  useEffect(() => {
    if(account) {
      getList();
      getPendingTransactions();
    }
  }, [account]);

  const getList = async () => {
    try {
      const response: any = await getUserTradeHistory({
        address: account as string,
        page: 1,
        limit: 30,
        network: chainInfo.chain.toLowerCase()
      });
      setList(response || []);
    } catch (error) {}
  };

  const getPendingTransactions = async () => {
    try {
      const response: any = await getPendingSwapTransactions({});
      setListPending(camelCaseKeys(response));
    } catch (error) {
      console.log('getPendingTransactions', error)
    }
  };

  const getAmountIn = (row: any) => {
    if (Number(row.amount0In) > 0) {
      return `${formatCurrency(row.amount0In, 18)} ${row?.pair?.token0Obj?.symbol}`;
    }
    if (Number(row.amount1In) > 0) {
      return `${formatCurrency(row.amount1In, 18)} ${row?.pair?.token1Obj?.symbol}`;
    }

    return '--';
  };

  const getAmountOut = (row: any) => {
    if (Number(row.amount0Out) > 0) {
      return `${formatCurrency(row.amount0Out, 18)} ${row?.pair?.token0Obj?.symbol}`;
    }
    if (Number(row.amount1Out) > 0) {
      return `${formatCurrency(row.amount1Out, 18)} ${row?.pair?.token1Obj?.symbol}`;
    }

    return '--';
  };

  const columns: ColumnProp[] = useMemo(
    () => [
      {
        id: 'txHash',
        label: 'Transaction',
        labelConfig: {
          fontSize: '12px',
          fontWeight: '500',
          color: '#B1B5C3',
        },
        config: {
          borderBottom: 'none',
        },
        render(row: any) {
          console.log('row', row);
          return (
            <Flex direction={"column"} color={"#FFFFFF"}>
              <Text fontWeight={"medium"}>{formatLongAddress(row?.txHash)}</Text>
              <Text>BTC: {row?.btcHash ? (
                <a
                  title="explorer"
                  href={`${MEMPOOL_URL}/tx/${row.btcHash}`}
                  target="_blank"
                  style={{textDecoration: 'underline', color: 'rgb(177, 227, 255)'}}
                >
                  {formatLongAddress(row?.btcHash)}
                </a>
              ) : '--'}</Text>
            </Flex>
          );
        },
      },
      {
        id: 'amount_in',
        label: 'Amount In',
        labelConfig: {
          fontSize: '12px',
          fontWeight: '500',
          color: '#B1B5C3',
        },
        config: {
          borderBottom: 'none',
        },
        render(row: any) {
          const amount = getAmountIn(row);
          return (
            <Text color={"#FFFFFF"}>
              {amount}
            </Text>
          );
        },
      },
      {
        id: 'amount_out',
        label: 'Amount Out',
        labelConfig: {
          fontSize: '12px',
          fontWeight: '500',
          color: '#B1B5C3',
        },
        config: {
          borderBottom: 'none',
        },
        render(row: any) {
          const amount = getAmountOut(row);
          return (
            <Text color={"#FFFFFF"}>
              {amount}
            </Text>
          );
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
          return <Text color={"#FFFFFF"}>{row?.timestamp ? moment(row.timestamp).format('lll') : '-'}</Text>;
        },
      },
      {
        id: 'status',
        label: 'Status',
        labelConfig: {
          fontSize: '12px',
          fontWeight: '500',
          color: '#B1B5C3',
        },
        config: {
          borderBottom: 'none',
        },
        render(row: any) {
          return <Text color={row?.status === 'pending' ? "#FFE899" : "rgb(0, 170, 108)"}>
            {
              row?.status === 'pending' ?
              (
                <a
                  title="explorer"
                  href={`${WALLET_URL}`}
                  target="_blank"
                  style={{textDecoration: 'underline'}}
                >
                  Process
                </a>
              ) :
              (
                <a
                  title="explorer"
                  href={`${TC_EXPLORER}/tx/${row.txHash}`}
                  target="_blank"
                  style={{textDecoration: 'underline'}}
                >
                  Success
                </a>
              )
            }
          </Text>;
        },
      },
    ],
    [],
  );

  return (
    <ListTable
      data={[...listPending, ...list]}
      columns={columns}
      showEmpty={true}
      hideIcon={true}
      theme={'dark'}
    />
  );
};

export default TokenHistory;
