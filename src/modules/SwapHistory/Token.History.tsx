/* eslint-disable @typescript-eslint/no-explicit-any */
import ListTable, {ColumnProp} from '@/components/Swap/listTable';
import {MEMPOOL_URL, WALLET_URL} from '@/configs';
import {getUserTradeHistory} from '@/services/swap';
import {camelCaseKeys, formatCurrency, formatLongAddress} from '@/utils';
import {Flex, Text} from '@chakra-ui/react';
import moment from 'moment';
import React, {useEffect, useMemo, useState} from 'react';
import {useWeb3React} from "@web3-react/core";
import usePendingSwapTransactions from "@/hooks/contract-operations/swap/usePendingSwapTransactions";
import {IResourceChain} from "@/interfaces/chain";
import {useWindowSize} from "@trustless-computer/dapp-core";
import {useSelector} from "react-redux";
import {selectPnftExchange} from "@/state/pnftExchange";

const TokenHistory = () => {
  const [list, setList] = useState<any[]>([]);
  const [listPending, setListPending] = useState<any[]>([]);
  const { account } = useWeb3React();
  const { mobileScreen } = useWindowSize();
  const currentSelectedChain: IResourceChain = useSelector(selectPnftExchange).currentChain;
  const { call: getPendingSwapTransactions } = usePendingSwapTransactions();

  useEffect(() => {
    if(account) {
      getList();
      getPendingTransactions();
    }
  }, [account, currentSelectedChain?.chain]);

  const getList = async () => {
    try {
      const response: any = await getUserTradeHistory({
        address: account as string,
        page: 1,
        limit: 30,
        network: currentSelectedChain?.chain?.toLowerCase()
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
    () => {
      if (mobileScreen) {
        return [
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
            id: 'amount_in_out',
            label: 'Amount In / Out',
            labelConfig: {
              fontSize: '12px',
              fontWeight: '500',
              color: '#FFFFFF',
            },
            config: {
              // borderBottom: 'none',
            },
            render(row: any) {
              const amountIn = getAmountIn(row);
              const amountOut = getAmountOut(row);

              return (
                <Flex direction={"column"} color={"#FFFFFF"}>
                  <Text>
                    {amountIn}
                  </Text>
                  <Text>
                    {amountOut}
                  </Text>
                </Flex>
              );
            },
          },
          {
            id: 'date_status',
            label: 'Date/Status',
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
                <Flex direction={"column"}>
                  <Text color={"#FFFFFF"} textAlign={"right"}>{row?.timestamp ? moment(row.timestamp).format('lll') : '-'}</Text>
                  <Text color={row?.status === 'pending' ? "#FFE899" : "rgb(0, 170, 108)"} textAlign={"right"}>
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
                            href={`${currentSelectedChain?.explorers[0]?.url}/tx/${row.txHash}`}
                            target="_blank"
                            style={{textDecoration: 'underline'}}
                          >
                            Success
                          </a>
                        )
                    }
                  </Text>
                </Flex>
              );
            },
          },
        ];
      }

      return [
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
            const amountIn = getAmountIn(row);
            return (
              <Text color={"#FFFFFF"}>
                {amountIn}
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
            const amountOut = getAmountOut(row);
            return (
              <Text color={"#FFFFFF"}>
                {amountOut}
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
                      href={`${currentSelectedChain?.explorers[0]?.url}/tx/${row.txHash}`}
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
      ]
    },
    [mobileScreen],
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
