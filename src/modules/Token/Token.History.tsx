/* eslint-disable @typescript-eslint/no-explicit-any */
import ListTable, { ColumnProp } from '@/components/Swap/listTable';
import { IToken } from '@/interfaces/token';
import { getTradeHistory } from '@/services/swap';
import { Text } from '@chakra-ui/react';
import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';

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

  const columns: ColumnProp[] = useMemo(
    () => [
      {
        id: 'date',
        label: 'createdAt',
        labelConfig: {
          fontSize: '12px',
          fontWeight: '500',
          color: '#B1B5C3',
        },
        config: {
          borderBottom: 'none',
        },
        render(row: any) {
          return <Text>{moment(row.createdAt).format('lll HH:mm')}</Text>;
        },
      },
    ],
    [],
  );

  return <ListTable data={list} columns={columns} />;
};

export default TokenHistory;
