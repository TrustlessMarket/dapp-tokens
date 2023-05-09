import BodyContainer from '@/components/Swap/bodyContainer';
import { colors } from '@/theme/colors';
import px2rem from '@/utils/px2rem';
import { Flex } from '@chakra-ui/react';
import styled from 'styled-components';

export const StyledTokenDetailContainer = styled(BodyContainer)`
  /* padding-top: ${px2rem(20)};
  padding-bottom: ${px2rem(20)}; */
  max-width: 1366px;
  margin: 0 auto;
  border-left: 1px solid #353945;
  border-right: 1px solid #353945;
  border-bottom: 1px solid #353945;
  > div {
    padding: 0px;
  }
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

  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 100%;
  }
`;

export const StyledTokenChartContainer = styled.div`
  height: 100%;
  position: relative;
`;

export const StyledTokenTopInfo = styled(Flex)`
  border-bottom: 1px solid ${colors.darkBorderColor};
  padding: ${px2rem(20)};
  .avatar {
    width: 50px;
    height: 50px;
  }
  .block-info {
    .title {
      color: white;
      font-weight: 600;
      font-size: ${px2rem(24)};
    }
    .desc {
      font-weight: 500;
      font-size: ${px2rem(16)};
      color: ${colors.white500};
    }
  }

  .diver-right {
    border-right: 1px solid ${colors.darkBorderColor};
    padding-right: ${px2rem(15)};
  }
`;
