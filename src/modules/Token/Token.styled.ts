import BodyContainer from '@/components/Swap/bodyContainer';
import px2rem from '@/utils/px2rem';
import styled from 'styled-components';

export const StyledTokenDetailContainer = styled(BodyContainer)`
  padding-top: ${px2rem(20)};
  padding-bottom: ${px2rem(20)};
  display: flex;
  &.token-notfound-container {
    display: flex;
    .token-notfound {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
      gap: 20px;
    }
  }
`;

export const StyledTokenChartContainer = styled.div`
  height: 100%;
  position: relative;
`;
