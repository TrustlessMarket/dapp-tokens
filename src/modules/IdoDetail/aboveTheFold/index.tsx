import styles from './styles.module.scss';
import {GridItem, SimpleGrid} from "@chakra-ui/react";
import Statistic from "@/modules/IdoDetail/statistic";
import BuyForm from "@/modules/IdoDetail/form";
import Card from "@/components/Swap/card";
import BodyContainer from "@/components/Swap/bodyContainer";

const IdoDetailContainer = () => {
  return (
    <BodyContainer className={styles.wrapper}>
      <SimpleGrid className={"max-content"} columns={[1, 2]} spacingX={10}>
        <GridItem>
          <Card bgColor={"#1E1E22"} paddingX={8} paddingY={6}>
            <BuyForm />
          </Card>
        </GridItem>
        <GridItem>
          <Statistic />
        </GridItem>
      </SimpleGrid>
    </BodyContainer>
  )
};

export default IdoDetailContainer;