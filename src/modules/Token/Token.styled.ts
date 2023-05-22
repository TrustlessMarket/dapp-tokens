import { colors } from '@/theme/colors';
import px2rem from '@/utils/px2rem';
import { Box, Grid, GridItem } from '@chakra-ui/react';
import styled from 'styled-components';

export const StyledTokenDetailContainer = styled(Grid)`
  background-color: inherit;
  border: 1px solid ${colors.darkBorderColor};
  grid-gap: 1px;
  grid-template-columns: minmax(350px, 350px) 1fr;
  grid-template-rows: minmax(64px, 130px) 1fr minmax(100px, 300px);
  grid-template-areas:
    'topinfo topinfo'
    'left chart'
    'left history';
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 100%;
  }
  @media screen and (max-width: 768px) {
    grid-template-columns: 100vw;
    grid-template-rows:
      minmax(300px, 373px) minmax(200px, 330px) minmax(100px, 300px)
      1fr;
    grid-template-areas:
      'topinfo'
      'chart'
      'history'
      'left';
  }
  &.loading-container,
  &.token-notfound-container {
    justify-content: center;
    align-items: center;
    display: flex;
    .token-notfound {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
      gap: 20px;
      p {
        color: white;
        font-size: ${px2rem(18)};
      }
      img {
        width: ${px2rem(348)};
        height: ${px2rem(348)};
      }
    }
  }
`;

export const StyledTokenTopInfo = styled(GridItem)`
  border-bottom: 1px solid ${colors.darkBorderColor};
  padding: ${px2rem(20)};
  width: 100%;
  align-items: center;
  justify-content: space-between;
  display: flex;

  .avatar {
    width: 50px;
    height: 50px;
  }
  .block-info {
    height: 70px;
    flex-direction: column;
    justify-content: space-around;
    padding-left: 25px;
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
    padding-right: 30px;
  }

  .mobile {
    display: none;
  }
  .desktop {
    display: block;
  }

  @media screen and (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    padding: ${px2rem(0)};
    .topinfo-left {
      flex-direction: column;
      align-items: flex-start;
      width: 100%;
    }
    .btn-container-right {
      display: none;
    }
    .diver-right {
      padding-right: 0;
      border-right: none;
    }
    .block-info {
      padding-left: 0;
      height: auto;
      .title {
        font-weight: 500;
        font-size: ${px2rem(20)};
        margin-left: ${px2rem(16)};
      }
      .desc {
        font-size: ${px2rem(12)};
        margin-left: ${px2rem(16)};
      }
    }
    .price {
      padding: ${px2rem(16)} 0px !important;
      border-bottom: 1px solid ${colors.darkBorderColor};
      width: 100%;
      margin-bottom: ${px2rem(16)};
    }
    .desktop {
      display: none;
    }
    .mobile {
      display: block;
    }
    .avatar-container {
      padding: ${px2rem(16)};
      align-items: center;
      justify-content: space-between;
      width: 100%;
    }
    .percent {
      width: 100%;
    }
    .percent-up-down {
      margin-left: ${px2rem(16)};
      .desc {
        margin-left: 0px;
      }
    }
    .percent-up-down-container {
      width: 100%;
      margin-bottom: ${px2rem(16)};
      .percent {
        flex: 1;
      }
    }
    .social-container {
      margin-left: ${px2rem(16)};
      margin-top: ${px2rem(10)};
    }
  }
`;

export const StyledLeftContentContainer = styled(GridItem)`
  border-right: 1px solid ${colors.darkBorderColor};
  height: calc(100vh - 130px);
  overflow-y: auto;
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

  .list-paired-container {
    /* max-height: 100%;
    overflow-y: auto;
    padding-bottom: ${px2rem(50)}; */
  }
`;

export const StyledTokenChartContainer = styled(GridItem)`
  position: relative;
  .wrapValues {
    display: flex;
    padding: 5px;
    div {
      font-size: ${px2rem(12)};
      margin-right: ${px2rem(3)};
    }
  }
`;

export const StyledHistoryContentContainer = styled(GridItem)`
  &.tab-container {
    border-top: 1px solid ${colors.darkBorderColor};
    .chakra-tabs,
    .chakra-tabs__tab-panels,
    .chakra-tabs__tab-panel,
    .chakra-tabs__tab-panel > div,
    .chakra-table__container,
    .chakra-table {
      height: 100%;
      overflow-y: unset;
    }
    .chakra-tabs,
    .chakra-table__container {
      height: 100%;
    }

    .chakra-tabs__tab-panels {
      height: calc(100% - 50px);
    }
    .chakra-tabs__tab-panel {
      padding: 10px;
      padding-bottom: 0px;
      max-height: inherit;
      > div {
        max-height: inherit;
      }
    }
    .chakra-tabs__tablist {
      button {
        font-size: ${px2rem(16)};
        color: ${colors.white500};
      }
    }
    .chakra-tabs__tab {
      &[aria-selected='true'] {
        background-color: transparent;
        color: white;
      }
    }
    .chakra-table {
      max-height: 100%;
      height: 100%;
      position: relative;
      thead {
        position: sticky;
        background-color: ${colors.dark};
        td {
          color: ${colors.white500};
        }
      }
      tbody {
        overflow: auto;
        max-height: 400px;
        td {
          color: ${colors.white};
        }
      }
    }
  }
`;

export const StyledTokenTrading = styled(Box)``;
