import SwapForm from '@/modules/Swap/form';
import { StyledTokens, UploadFileContainer } from './Tokens.styled';

const Swap = () => {
  return (
    <StyledTokens>
      <div className="background"></div>
      <div>
        <h3 className="upload_title">BRC-20 on Bitcoin</h3>
      </div>
      <UploadFileContainer>
        <div className="upload_left">
          <SwapForm />
        </div>
      </UploadFileContainer>
    </StyledTokens>
  );
};

export default Swap;
