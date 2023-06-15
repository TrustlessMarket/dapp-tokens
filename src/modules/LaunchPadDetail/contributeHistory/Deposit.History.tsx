/* eslint-disable @typescript-eslint/no-explicit-any */
import ListTable, {ColumnProp} from '@/components/Swap/listTable';
import {ALCHEMY_API_KEY, ETHERSCAN_URL} from '@/configs';
import {formatCurrency, formatLongAddress} from '@/utils';
import {Flex, Text} from '@chakra-ui/react';
import {useEffect, useMemo, useState} from 'react';
import {useWeb3React} from "@web3-react/core";

import {Alchemy, AssetTransfersCategory, Network} from "alchemy-sdk";
import {getLaunchpadDepositAddress} from "@/services/launchpad";
import {useSelector} from "react-redux";
import {getIsAuthenticatedSelector} from "@/state/user/selector";
import {colors} from "@/theme/colors";

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
  const [loading, setLoading] = useState(true);

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
        // toAddress: "0x6600CaDdE569B4b43B2A1E3a5271B77C7E5bC300",
        toAddress: depositAddressInfo?.depositAddress,
        category: [AssetTransfersCategory.EXTERNAL, AssetTransfersCategory.INTERNAL],
      });
      setList(data?.transfers || []);
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
                href={`${ETHERSCAN_URL}/tx/${row?.hash}`}
                target="_blank"
                style={{textDecoration: 'underline', color: colors.bluePrimary}}
              >
                {formatLongAddress(row?.hash)}
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
              {formatCurrency(row?.value)} {row?.asset}
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
        render() {
          return <Text color={"rgb(0, 170, 108)"}>
            Success
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

export default DepositHistory;
