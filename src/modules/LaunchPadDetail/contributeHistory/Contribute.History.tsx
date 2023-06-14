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

interface LabelStatusMap {
  [name: string]: any;
}

const CONTRIBUTE_STATUS: LabelStatusMap = {
  pending: {
    label: 'Pending',
    color: '#FFE899',
  },
  processing: {
    label: 'Processing',
    color: 'rgba(51, 133, 255, 1)',
  },
  done: {
    label: 'Success',
    color: 'rgba(4, 197, 127, 1)',
  },
  failed: {
    label: 'Failed',
    color: 'rgba(255, 71, 71, 1)',
  },
};

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
          return <Text color={"#000000"}>{row?.timestamp ? moment(row.timestamp).format('lll') : '-'}</Text>;
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
          const status = CONTRIBUTE_STATUS[row?.status];

          return <Text color={status.color}>
            {
              status.label
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
