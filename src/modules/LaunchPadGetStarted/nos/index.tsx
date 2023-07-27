import styles from "../styles.module.scss";
import BodyContainer from "@/components/Swap/bodyContainer";
import SwapTokens from "./swapTokens";
import SectionContainer from "@/components/Swap/sectionContainer";
import {Box} from "@chakra-ui/react";

const LaunchPadGetStarted = () => {
  return (
    <BodyContainer className={styles.wrapper}>
      <SectionContainer>
        <div>
          <h3 className={styles.upload_title}>Instructions for Participating in New Bitcoin LaunchPad</h3>
        </div>
        <Box mt={6}>
          <SwapTokens />
        </Box>
      </SectionContainer>
    </BodyContainer>
  );
};

export default LaunchPadGetStarted;
