import SwapForm from '@/modules/Swap/form';
import { StyledTokens, UploadFileContainer } from './Tokens.styled';

const Swap = () => {
  return (
    <StyledTokens>
      <div className="background"></div>
      <div>
        <h3 className="upload_title">Swap token</h3>
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
