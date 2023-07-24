import {Box, Tab, TabList, TabPanel, TabPanels, Tabs} from "@chakra-ui/react";
import styles from "@/modules/GetStarted/styles.module.scss";
import BodyContainer from "@/components/Swap/bodyContainer";
import SwapTokens from "@/modules/GetStarted/tc/swapTokens";
import CreateTokens from "@/modules/GetStarted/tc/createTokens";
import SectionContainer from "@/components/Swap/sectionContainer";

const GetStarted = () => {
  return (
    <BodyContainer className={styles.wrapper}>
      <SectionContainer>
        <div>
          <h3 className={styles.upload_title}>Let’s get you ready for Bitcoin DeFi!</h3>
        </div>
        <Box
          className={styles.tabContainer}
          // style={{
          //   borderTop: `1px solid ${colors.darkBorderColor}`,
          //   maxHeight: '300px',
          // }}
          flex={1}
          mt={6}
        >
          <Tabs isFitted variant='soft-rounded'>
            <TabList mb={6} mt={6}>
              <Tab>Swap tokens</Tab>
              <Tab>Create tokens</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <SwapTokens />
              </TabPanel>
              <TabPanel>
                <CreateTokens />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </SectionContainer>
    </BodyContainer>
  );
};

export default GetStarted;
