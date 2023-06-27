import { px2rem } from '@trustless-computer/dapp-core';
import styled from 'styled-components';

export const StyledEmpty = styled.span<{ isTable: boolean }>`
  &.notFound {
    display: grid;
    place-items: center;
    position: relative;

    h5 {
      color: #ffffff;
      font-weight: 500 !important;
      font-size: ${px2rem(16)};
      margin-top: ${px2rem(16)};
    }
  }
`;
