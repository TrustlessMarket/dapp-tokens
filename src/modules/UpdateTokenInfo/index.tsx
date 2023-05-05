import UpdateTokenInfoForm from '@/modules/UpdateTokenInfo/form';
import {StyledTokens, UploadFileContainer} from './UpdateTokenInfo.styled';
import BodyContainer from "@/components/Swap/bodyContainer";
import styles from './styles.module.scss';

const UpdateTokenInfo = () => {
  return (
    <BodyContainer className={styles.wrapper}>
      <StyledTokens>
        <div>
          <h3 className="upload_title">Update token info</h3>
        </div>
        <UploadFileContainer>
          <div className="upload_left">
            <UpdateTokenInfoForm />
          </div>
        </UploadFileContainer>
      </StyledTokens>
    </BodyContainer>
  );
};

export default UpdateTokenInfo;
