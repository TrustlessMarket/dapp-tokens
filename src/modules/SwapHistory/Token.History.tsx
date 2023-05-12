/* eslint-disable @typescript-eslint/no-explicit-any */
import ListTable, {ColumnProp} from '@/components/Swap/listTable';
import {TC_EXPLORER, WALLET_URL} from '@/configs';
import {getUserTradeHistory} from '@/services/swap';
import {colors} from '@/theme/colors';
import {camelCaseKeys, compareString, formatCurrency} from '@/utils';
import {Button, Flex, Text} from '@chakra-ui/react';
import moment from 'moment';
import {useEffect, useMemo, useState} from 'react';
import {RxExternalLink} from 'react-icons/rx';
import {useWeb3React} from "@web3-react/core";
import usePendingSwapTransactions from "@/hooks/contract-operations/swap/usePendingSwapTransactions";
import {WBTC_ADDRESS} from "@/modules/Swap/form";

const TokenHistory = () => {
  const [list, setList] = useState<any[]>([]);
  const [listPending, setListPending] = useState<any[]>([]);
  const { account } = useWeb3React();
  // const account = '0x07e51AEc82C7163e3237cfbf8C0E6A07413FA18E';
  const { call: getPendingSwapTransactions } = usePendingSwapTransactions();

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

  const checkIsSell = (row: any) => {
    let isSell = true;
    if (
      (compareString(row?.pair?.token0, WBTC_ADDRESS) &&
        Number(row.amount1Out) > 0) ||
      (compareString(row?.pair?.token1, WBTC_ADDRESS) &&
        Number(row.amount0Out) > 0)
    ) {
      isSell = false;
    }
    return isSell;
  };

  const getAmount = (row: any) => {
    if (
      compareString(row?.pair?.token0, WBTC_ADDRESS) &&
      Number(row.amount1Out) > 0
    ) {
      return row.amount1Out;
    }

    if (
      compareString(row?.pair?.token1, WBTC_ADDRESS) &&
      Number(row.amount0Out) > 0
    ) {
      return row.amount0Out;
    }

    if (
      !compareString(row?.pair?.token1, WBTC_ADDRESS) &&
      Number(row.amount1In) > 0
    ) {
      return row.amount1In;
    }

    if (
      !compareString(row?.pair?.token0, WBTC_ADDRESS) &&
      Number(row.amount0In) > 0
    ) {
      return row.amount0In;
    }

    return 0;
  };

  const columns: ColumnProp[] = useMemo(
    () => [
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
          let type = 'Buy';
          let color = colors.greenPrimary;

          if (checkIsSell(row)) {
            type = 'Sell';
            color = colors.redPrimary;
          }

          return <Text style={{ color }}>{type}</Text>;
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
          borderBottom: 'none',
        },
        render(row: any) {
          return row?.status !== 'pending' && (
            <Text color={"#FFFFFF"}>
              {formatCurrency(row.price, 18)} {row.pair.token1Obj.symbol}
            </Text>
          );
        },
      },
      {
        id: 'amount',
        label: 'Amount',
        labelConfig: {
          fontSize: '12px',
          fontWeight: '500',
          color: '#B1B5C3',
        },
        config: {
          borderBottom: 'none',
        },
        render(row: any) {
          const amount = getAmount(row);
          return (
            <Text color={"#FFFFFF"}>
              {formatCurrency(amount, 18)} {row.pair.token0Obj.symbol}
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
          return <Text color={"#FFFFFF"}>{row?.createdAt ? moment(row.createdAt).format('lll') : '-'}</Text>;
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
          return <Text color={row?.status === 'pending' ? "#FFE899" : "rgb(0, 170, 108)"}>{row?.status === 'pending' ? 'Pending' : 'Success'}</Text>;
        },
      },
      {
        id: 'action',
        label: 'Actions',
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
              {
                row.txHash ? (
                  <a
                    title="explorer"
                    href={`${TC_EXPLORER}/tx/${row.txHash}`}
                    target="_blank"
                  >
                    <RxExternalLink />
                  </a>
                ) : (
                  <a
                    title="explorer"
                    href={`${WALLET_URL}`}
                    target="_blank"
                  >
                    <Button bg={"#FFE899"} color={"#000000"} borderRadius={"4px"}>
                      Process
                    </Button>
                  </a>
                )
              }
            </Flex>
          );
        },
      },
    ],
    [],
  );

  return (
    <ListTable data={[...listPending, ...list]} columns={columns} />
  );
};

export default TokenHistory;
