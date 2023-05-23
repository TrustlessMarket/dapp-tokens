import styles from './styles.module.scss';
import IdoFaqs from "./faqs";
import IdoDescription from "@/modules/IdoDetail/description";
import {Box} from "@chakra-ui/react";

const IdoDetailContainer = () => {
  return (
    <Box className={styles.wrapper}>
      <IdoDescription />
      <IdoFaqs />
    </Box>
  )
};

export default IdoDetailContainer;