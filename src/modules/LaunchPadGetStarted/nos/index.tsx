import styles from "../styles.module.scss";
import BodyContainer from "@/components/Swap/bodyContainer";
import SwapTokens from "./swapTokens";
import SectionContainer from "@/components/Swap/sectionContainer";
import {Box, Tab, TabList, TabPanel, TabPanels, Tabs} from "@chakra-ui/react";
import CreateTokens from "./createTokens";

const LaunchPadGetStarted = () => {
  return (
    <BodyContainer className={styles.wrapper}>
      <SectionContainer>
        <div>
          <h3 className={styles.upload_title}>Instructions for Participating in New Bitcoin LaunchPad</h3>
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
              <Tab>Vote</Tab>
              <Tab>Contribute</Tab>
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
  )
};

export default LaunchPadGetStarted;
