import SwapForm from '@/modules/Swap/form';
import { StyledTokens, UploadFileContainer } from './Tokens.styled';
import {Text} from "@chakra-ui/react";
import px2rem from "@/utils/px2rem";

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
      <Text fontSize="md" color="#FFFFFF" textAlign={'center'} margin={"0 auto"} maxW={px2rem(400)} position={"relative"}>
        The current slippage is set at 100% due to Bitcoin’s long block time. Trade at your own risk.
      </Text>
    </StyledTokens>
  );
};

export default Swap;
