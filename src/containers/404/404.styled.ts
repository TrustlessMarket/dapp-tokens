import BodyContainer from '@/components/Swap/bodyContainer';
import { colors } from '@/theme/colors';
import { px2rem } from '@trustless-computer/dapp-core';
import styled from 'styled-components';

const Container = styled(BodyContainer)`
  display: flex;
  flex: 1;
  flex-direction: column;
  /* padding-top: 50px; */
  justify-content: center;

  .title {
    font-weight: 500;
    font-size: ${px2rem(56)};
    line-height: 66px;
    align-items: center;
    align-self: center;
    letter-spacing: -0.02em;
    color: ${colors.white};
  }
`;

export { Container };
