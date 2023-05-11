/* eslint-disable @typescript-eslint/no-explicit-any */
import ListTable, { ColumnProp } from '@/components/Swap/listTable';
import { TC_EXPLORER } from '@/configs';
import { IToken } from '@/interfaces/token';
import { getTradeHistory } from '@/services/swap';
import { colors } from '@/theme/colors';
import { compareString, formatCurrency } from '@/utils';
import { Flex, Text } from '@chakra-ui/react';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { RxExternalLink } from 'react-icons/rx';
import { DEFAULT_FROM_TOKEN_ADDRESS } from '../Pools';
import { StyledTokenTrading } from './Token.styled';

const TokenHistory = ({ data }: { data: IToken }) => {
  const [list, setList] = useState<any[]>([]);

  useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
    try {
      const response: any = await getTradeHistory({
        contract_address: data.address,
        page: 1,
        limit: 30,
      });
      setList(response);
    } catch (error) {}
  };

  const checkIsSell = (row: any) => {
    let isSell = true;
    if (
      (compareString(row?.pair?.token0, DEFAULT_FROM_TOKEN_ADDRESS) &&
        Number(row.amount1Out) > 0) ||
      (compareString(row?.pair?.token1, DEFAULT_FROM_TOKEN_ADDRESS) &&
        Number(row.amount0Out) > 0)
    ) {
      isSell = false;
    }
    return isSell;
  };

  const getAmount = (row: any) => {
    if (
      compareString(row?.pair?.token0, DEFAULT_FROM_TOKEN_ADDRESS) &&
      Number(row.amount1Out) > 0
    ) {
      return row.amount1Out;
    }

    if (
      compareString(row?.pair?.token1, DEFAULT_FROM_TOKEN_ADDRESS) &&
      Number(row.amount0Out) > 0
    ) {
      return row.amount0Out;
    }

    if (
      !compareString(row?.pair?.token1, DEFAULT_FROM_TOKEN_ADDRESS) &&
      Number(row.amount1In) > 0
    ) {
      return row.amount1In;
    }

    if (
      !compareString(row?.pair?.token0, DEFAULT_FROM_TOKEN_ADDRESS) &&
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
          return (
            <Text>
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
            <Text>
              {formatCurrency(amount, 18)} {row.pair.token0Obj.symbol}
            </Text>
          );
        },
      },
      //   {
      //     id: 'maker',
      //     label: 'Maker',
      //     labelConfig: {
      //       fontSize: '12px',
      //       fontWeight: '500',
      //       color: '#B1B5C3',
      //     },
      //     config: {
      //       borderBottom: 'none',
      //     },
      //     render(row: any) {
      //       return <Text>{shortCryptoAddress(row.sender, 8)}</Text>;
      //     },
      //   },
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
          return <Text>{moment(row.createdAt).format('lll')}</Text>;
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
            <Flex>
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
    [],
  );

  return (
    <StyledTokenTrading>
      <ListTable data={list} columns={columns} />
    </StyledTokenTrading>
  );
};

export default TokenHistory;