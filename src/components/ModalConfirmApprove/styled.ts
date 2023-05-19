import px2rem from '@/utils/px2rem';
import { Box } from '@chakra-ui/react';
import styled from 'styled-components';

export const StyledModalConfirmApprove = styled(Box)`
  .desc {
    font-size: ${px2rem(16)};
    font-weight: 500;
  }
  img {
    margin-top: ${px2rem(20)};
  }
`;
