/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from './styles.module.scss';
import {GridItem, SimpleGrid} from "@chakra-ui/react";
import Statistic from "@/modules/LaunchPadDetail/statistic";
import BuyForm from "@/modules/LaunchPadDetail/form";
import Card from "@/components/Swap/card";
import BodyContainer from "@/components/Swap/bodyContainer";
import {useLaunchPadStatus} from "@/modules/Launchpad/Launchpad.Status";

const LaunchpadStarting = ({poolDetail}: any) => {
  const [status] = useLaunchPadStatus({ row: poolDetail });

  console.log('statusstatusstatus', status);

  return (
    <BodyContainer className={styles.wrapper}>
      <SimpleGrid className={"max-content"} columns={[1, 2]} spacingX={8}>
        <GridItem>
          <Card bgColor={"#1E1E22"} paddingX={8} paddingY={6}>
            <BuyForm poolDetail={poolDetail}/>
          </Card>
        </GridItem>
        <GridItem>
          <Statistic poolDetail={poolDetail}/>
        </GridItem>
      </SimpleGrid>
    </BodyContainer>
  )
};

export default LaunchpadStarting;