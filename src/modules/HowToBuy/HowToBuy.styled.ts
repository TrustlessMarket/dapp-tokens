import px2rem from '@/utils/px2rem';
import { Box } from '@chakra-ui/react';
import styled from 'styled-components';

export const StyledHowToBuyContainer = styled(Box)`
  &.light {
  }

  .title {
    font-size: ${px2rem(50)};
    text-align: center;
    font-weight: 700;
    margin-top: ${px2rem(30)};
    letter-spacing: ${px2rem(2)};
  }
`;
