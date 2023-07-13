/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from "./styles.module.scss";
import DepositHistory from "./Deposit.History";
import DepositBtcHistory from "./Deposit.Btc.History";
import ContributeHistory from "./Contribute.History";
import {Box, Tab, TabList, TabPanel, TabPanels, Tabs} from "@chakra-ui/react";
import {IResourceChain} from "@/interfaces/chain";
import {useSelector} from "react-redux";
import {selectPnftExchange} from "@/state/pnftExchange";
import {
  compareString,
  getWETHAddress
} from '@/utils';
const TMTransferHistory = (props: any) => {
  const { poolDetail } = props;
  const currentChain: IResourceChain = useSelector(selectPnftExchange).currentChain;

  return (
      <Box className={styles.wrapper}>
        <Box
            className={styles.tabContainer}
            flex={1}
            mt={6}
        >
          <Tabs isFitted variant='soft-rounded'>
            <TabList mb={6} mt={6}>
              <Tab>{currentChain?.chain} Transaction</Tab>
              <Tab>{compareString(poolDetail?.liquidityTokenAddress,getWETHAddress())?"ETH":"BITCOIN"} Transaction</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <ContributeHistory poolDetail={poolDetail} />
              </TabPanel>
              <TabPanel>
                {compareString(poolDetail?.liquidityTokenAddress,getWETHAddress())?
                    <DepositHistory poolDetail={poolDetail} />: <DepositBtcHistory poolDetail={poolDetail} />}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Box>
  );
};

export default TMTransferHistory;
