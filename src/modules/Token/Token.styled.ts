import BodyContainer from '@/components/Swap/bodyContainer';
import { colors } from '@/theme/colors';
import px2rem from '@/utils/px2rem';
import { Flex } from '@chakra-ui/react';
import styled from 'styled-components';

export const StyledTokenDetailContainer = styled(BodyContainer)`
  /* max-width: 1366px; */
  margin: 0 auto;
  border-left: 1px solid #353945;
  border-right: 1px solid #353945;
  border-bottom: 1px solid #353945;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  > div {
    padding: 0px;
    margin: unset;
    width: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
  }
  &.loading-container {
    > div {
      justify-content: center;
      align-items: center;
    }
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
  .wrapValues {
    display: flex;
    padding: 5px;
    div {
      font-size: 13px;
      margin-right: 5px;
      span {
        font-weight: 500;
      }
    }
  }
`;

export const StyledTokenTopInfo = styled(Flex)`
  border-bottom: 1px solid ${colors.darkBorderColor};
  padding: ${px2rem(20)};
  width: 100%;
  .avatar {
    width: 50px;
    height: 50px;
  }
  .block-info {
    height: 100%;
    flex-direction: column;
    justify-content: space-around;
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

export const StyledTokenLeftInfo = styled(Flex)`
  /* border-right: 1px solid ${colors.darkBorderColor}; */
  height: 100%;
  max-width: 360px;
  flex-direction: column;
  .title {
    color: ${colors.white};
    font-size: 12px;
    font-weight: bold;
  }
  .token-info {
    padding: ${px2rem(10)};
    width: 100%;
    .item-info {
      p {
        color: ${colors.white};
      }
    }
  }

  .dive-bottom {
    border-bottom: 1px solid ${colors.darkBorderColor};
  }

  .empty-pool {
    color: ${colors.white500};
    font-size: ${px2rem(12)};
    text-align: center;
    margin-top: ${px2rem(10)};
  }

  .btn-add-liquid {
    margin-top: ${px2rem(10)};
    max-width: 50%;
    color: ${colors.white};
  }

  .accordion-container {
    .chakra-accordion__button,
    .chakra-accordion__panel {
      background-color: ${colors.darkBorderColor};
      color: ${colors.white};
      border-radius: 0;
      .label,
      .value {
        color: ${colors.white};
      }
    }
  }
`;
