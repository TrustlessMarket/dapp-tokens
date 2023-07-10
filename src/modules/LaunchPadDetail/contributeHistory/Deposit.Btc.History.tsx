/* eslint-disable @typescript-eslint/no-explicit-any */
import ListTable, {ColumnProp} from '@/components/Swap/listTable';
import { formatLongAddress} from '@/utils';
import {Flex, Text} from '@chakra-ui/react';
import {useEffect, useMemo, useState} from 'react';
import {useWeb3React} from "@web3-react/core";

import {getLaunchpadDepositAddress} from "@/services/launchpad";
import {useSelector} from "react-redux";
import {getIsAuthenticatedSelector} from "@/state/user/selector";
import {colors} from "@/theme/colors";
import {isProduction} from "@/utils/commons";



const DepositBtcHistory = (props: any) => {
  const { poolDetail } = props;
  const [list, setList] = useState<any[]>([]);
  const { account } = useWeb3React();
  const [depositAddressInfo, setDepositAddressInfo] = useState<any>();
  const isAuthenticated = useSelector(getIsAuthenticatedSelector);
  const [loading, setLoading] = useState(true);
  const testnet = isProduction() ?"":"/testnet"

      useEffect(() => {
    if(account && poolDetail?.id) {
      fetchData();
    }
  }, [account, isAuthenticated, poolDetail?.id]);

  useEffect(() => {
    if(depositAddressInfo?.depositAddress) {
      getList();
    }
  }, [depositAddressInfo?.depositAddress]);

  const fetchData = async () => {
    try {
      const response: any = await Promise.all([
        getLaunchpadDepositAddress({
          network: 'bitcoin',
          address: account,
          launchpad_id: poolDetail?.id,
        }),
      ]);
      setDepositAddressInfo(response[0]);
    } catch (error) {
      console.log('Launchpad detail form fetchData', error);
    }
  };

  const getList = async () => {
    try {
      const res = await fetch(
          `https://blockstream.info${testnet}/api/address/${depositAddressInfo?.depositAddress}/txs`,
      ).then((res) => {
        return res.json();
      });
      for(let  index = res.length-1; index>=0; index--)
      {
        let isOutput = false;
        while (res[index].vout.length>0){
          if (res[index].vout[0].scriptpubkey_address == "tb1q3xe4u7egehguj7n8d99khacfj9ay48wdj7qjtd") {
            isOutput = true
            break;
          }
          else{
            res[index].vout.splice(0, 1);
          }
        }
        if(!isOutput) {
          res.splice(index, 1);
        }
      }

      setList(res || []);
    } catch (error) {

    } finally {
      setLoading(false);
    }
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
          return (
            <Flex direction={"column"} color={"#FFFFFF"}>
              <a
                title="explorer"
                href={`https://blockstream.info${testnet}/tx/${row?.txid}`}
                target="_blank"
                style={{textDecoration: 'underline', color: colors.bluePrimary}}
              >
                {formatLongAddress(row?.txid)}
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
              {row.vout[0].value/Math.pow(10,8)} BTC
            </Text>
          );
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
          return <Text color={"rgb(0, 170, 108)"}>
            {row?.status.confirmed?"Confirmed":"Unconfirmed"}
          </Text>;
        },
      },
    ],
    [],
  );

  return (
    <ListTable
      data={list}
      columns={columns}
      initialLoading={loading}
      showEmpty={true}
      hideIcon={true}
      theme={'light'}
    />
  );
};

export default DepositBtcHistory;
