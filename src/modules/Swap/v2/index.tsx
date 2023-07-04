import SwapForm from '@/modules/Swap/v2/form';
import {StyledTokens, UploadFileContainer} from './Swap.styled';
import {Text} from "@chakra-ui/react";
import px2rem from "@/utils/px2rem";
import BodyContainer from "@/components/Swap/bodyContainer";
import styles from './styles.module.scss';

const Swap = () => {
  return (
    <BodyContainer className={styles.wrapper}>
      <StyledTokens>
        <div>
          <h3 className="upload_title">Swap token</h3>
        </div>
        <UploadFileContainer>
          <div className="upload_left">
            <SwapForm />
          </div>
        </UploadFileContainer>
      </StyledTokens>
    </BodyContainer>
  );
};

export default Swap;
