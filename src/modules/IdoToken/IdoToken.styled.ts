import BodyContainer from '@/components/Swap/bodyContainer';
import px2rem from '@/utils/px2rem';
import styled from 'styled-components';

export const StyledIdoContainer = styled(BodyContainer)`
  margin: ${px2rem(25)} auto;
  > div {
    height: 100%;
  }
  .title {
    color: white;
    text-align: center;
    span {
      color: orange;
    }
  }
`;
