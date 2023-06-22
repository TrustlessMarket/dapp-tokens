/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from "./styles.module.scss";
import DepositHistory from "./Deposit.History";
import ContributeHistory from "./Contribute.History";
import {Box, Tab, TabList, TabPanel, TabPanels, Tabs} from "@chakra-ui/react";

const TMTransferHistory = (props: any) => {
  const { poolDetail } = props;
  return (
    <Box className={styles.wrapper}>
      <Box
        className={styles.tabContainer}
        flex={1}
        mt={6}
      >
        <Tabs isFitted variant='soft-rounded'>
          <TabList mb={6} mt={6}>
            <Tab>TC Transaction</Tab>
            <Tab>ETH Transaction</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <ContributeHistory poolDetail={poolDetail} />
            </TabPanel>
            <TabPanel>
              <DepositHistory poolDetail={poolDetail} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  );
};

export default TMTransferHistory;
