import BodyContainer from "@/components/Swap/bodyContainer";
import styles from './styles.module.scss';
import Faqs from "./faqs";

const IdoDetailContainer = () => {
  return (
    <BodyContainer className={styles.wrapper}>
      <Faqs />
    </BodyContainer>
  )
};

export default IdoDetailContainer;