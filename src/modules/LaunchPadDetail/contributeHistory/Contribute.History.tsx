/* eslint-disable @typescript-eslint/no-explicit-any */
import ListTable, {ColumnProp} from '@/components/Swap/listTable';
import {TC_EXPLORER} from '@/configs';
import {formatCurrency, formatLongAddress} from '@/utils';
import {Flex, Text} from '@chakra-ui/react';
import moment from 'moment';
import React, {useEffect, useMemo, useState} from 'react';
import {useWeb3React} from "@web3-react/core";
import {getLaunchpadUserResultDetail} from "@/services/launchpad";
import {colors} from "@/theme/colors";

const ContributeHistory = (props: any) => {
  const { poolDetail } = props;
  const [list, setList] = useState<any[]>([]);
  const { account } = useWeb3React();

  useEffect(() => {
    if(account && poolDetail?.launchpad) {
      getList();
    }
  }, [account, poolDetail?.launchpad]);

  const getList = async () => {
    try {
      const response: any = await getLaunchpadUserResultDetail({
        address: account,
        pool_address: poolDetail?.launchpad,
        page: 1,
        limit: 30,
      });
      setList(response || []);
    } catch (error) {}
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
              <a
                target="_blank"
                href={`${TC_EXPLORER}/tx/${row.txHash}`}
                style={{textDecoration: 'underline', color: colors.bluePrimary}}
              >
                {formatLongAddress(row?.txHash)}
              </a>
            </Flex>
          );
        },
      },
      {
        id: 'amount_in',
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
          return (
            <Text color={"#000000"}>
              {formatCurrency(row?.amount)} {poolDetail?.liquidityToken?.symbol}
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
          return <Text color={"#000000"}>{row?.createdAt ? moment(row.createdAt).format('lll') : '-'}</Text>;
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
              'Process' :
              'Success'
            }
          </Text>;
        },
      },
    ],
    [],
  );

  return (
    <ListTable data={list} columns={columns} />
  );
};

export default ContributeHistory;
