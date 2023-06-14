/* eslint-disable @typescript-eslint/no-explicit-any */
import ListTable, {ColumnProp} from '@/components/Swap/listTable';
import {ALCHEMY_API_KEY, ETHERSCAN_URL} from '@/configs';
import {formatCurrency, formatLongAddress} from '@/utils';
import {Flex, Text} from '@chakra-ui/react';
import {useEffect, useMemo, useState} from 'react';
import {useWeb3React} from "@web3-react/core";

import {Alchemy, Network, AssetTransfersCategory} from "alchemy-sdk";
import {getLaunchpadDepositAddress} from "@/services/launchpad";
import {LAUNCHPAD_STATUS} from "@/modules/Launchpad/Launchpad.Status";
import {useSelector} from "react-redux";
import {getIsAuthenticatedSelector} from "@/state/user/selector";

const config = {
  apiKey: ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const DepositHistory = (props: any) => {
  const { poolDetail } = props;
  const [list, setList] = useState<any[]>([]);
  const { account } = useWeb3React();
  const [depositAddressInfo, setDepositAddressInfo] = useState<any>();
  const alchemy = new Alchemy(config);
  const isAuthenticated = useSelector(getIsAuthenticatedSelector);

  useEffect(() => {
    if (![LAUNCHPAD_STATUS.Draft].includes(poolDetail?.state)) {
      fetchData();
    }
  }, [account, isAuthenticated, JSON.stringify(poolDetail)]);

  useEffect(() => {
    if(depositAddressInfo?.depositAddress) {
      getList();
    }
  }, [depositAddressInfo?.depositAddress]);

  const fetchData = async () => {
    try {
      const response: any = await Promise.all([
        getLaunchpadDepositAddress({
          network: 'ethereum',
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
      const data = await alchemy.core.getAssetTransfers({
        fromBlock: "0x0",
        toAddress: "0x6600CaDdE569B4b43B2A1E3a5271B77C7E5bC300",
        // toAddress: depositAddressInfo?.depositAddress,
        category: [AssetTransfersCategory.EXTERNAL, AssetTransfersCategory.INTERNAL],
      });
      setList(data?.transfers || []);
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
              <Text fontWeight={"medium"}>
                <a
                  title="explorer"
                  href={`${ETHERSCAN_URL}/tx/${row?.hash}`}
                  target="_blank"
                  style={{textDecoration: 'underline', color: 'rgb(177, 227, 255)'}}
                >
                {formatLongAddress(row?.hash)}
                </a>
              </Text>
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
          return (
            <Text color={"#000000"}>
              {formatCurrency(row?.value)} {row?.asset}
            </Text>
          );
        },
      },
    ],
    [],
  );

  return (
    <ListTable data={list} columns={columns} />
  );
};

export default DepositHistory;
