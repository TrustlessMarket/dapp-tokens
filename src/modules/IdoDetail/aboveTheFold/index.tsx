import styles from './styles.module.scss';
import {GridItem, SimpleGrid} from "@chakra-ui/react";
import SectionContainer from "@/components/Swap/sectionContainer";
import Statistic from "@/modules/IdoDetail/statistic";
import BuyForm from "@/modules/IdoDetail/form";
import Card from "@/components/Swap/card";

const IdoDetailContainer = () => {
  return (
    <SectionContainer className={styles.wrapper}>
      <SimpleGrid columns={[1, 2]} spacingX={10} spacingY={[6, "120px"]}>
        <GridItem>
          <Card bgColor={"#1E1E22"} paddingX={8} paddingY={6}>
            <BuyForm />
          </Card>
        </GridItem>
        <GridItem>
          <Statistic />
        </GridItem>
      </SimpleGrid>
    </SectionContainer>
  )
};

export default IdoDetailContainer;