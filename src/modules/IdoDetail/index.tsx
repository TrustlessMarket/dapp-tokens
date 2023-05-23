import styles from './styles.module.scss';
import IdoFaqs from "./faqs";
import IdoDescription from "@/modules/IdoDetail/description";
import {Box} from "@chakra-ui/react";
import AboveTheFold from "@/modules/IdoDetail/aboveTheFold";

const IdoDetailContainer = () => {
  return (
    <Box className={styles.wrapper}>
      <AboveTheFold />
      <IdoDescription />
      <IdoFaqs />
    </Box>
  )
};

export default IdoDetailContainer;