import px2rem from '@/utils/px2rem';
import styled from 'styled-components';

export const StyledHorizontalItem = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: ${px2rem(5)};
  padding-top: ${px2rem(5)};
  p {
    color: black;
    font-size: ${px2rem(12)}!important;
    &.label {
      font-weight: 200;
      opacity: 0.7;
    }
  }
`;
