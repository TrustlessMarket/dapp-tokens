import BodyContainer from '@/components/Swap/bodyContainer';
import { colors } from '@/theme/colors';
import px2rem from '@/utils/px2rem';
import { Badge } from '@chakra-ui/react';
import styled from 'styled-components';

export const StyledIdoContainer = styled(BodyContainer)`
  margin: ${px2rem(25)} auto;
  /* max-width: 1366px; */
  > div {
    height: 100%;
    padding: 0;
  }
  .title {
    color: white;
    text-align: center;
    font-size: 48px;
    font-weight: 500;
    span {
      color: orange;
    }
  }

  .desc {
    font-size: 20px;
    font-weight: 400;
    line-height: 30px;
    text-align: center;
    color: ${colors.white};
    margin: 16px auto;
    max-width: 1024px;
  }

  .chakra-table {
    /* border: 1px solid ${colors.darkBorderColor}!important; */
    /* border-radius: 6px;
    overflow: hidden; */
    thead {
      background-color: #1e1e22;
      th {
        div {
          text-transform: uppercase;
          color: ${colors.white};
          font-weight: 500;
          font-size: 12px;
          line-height: 22px;
        }
        padding: 12px 16px !important;
      }
    }
    tbody {
      tr {
        border-bottom: 1px solid ${colors.white100};
        /* background-color: ${colors.white50};
        :nth-child(even) {
          background-color: ${colors.white100};
        } */
      }
      td {
        padding: 20px 16px !important;
        color: ${colors.white};
        vertical-align: middle;
        font-size: 16px;
        font-weight: 500;
        img {
          width: 40px;
          height: 40px;
          border-radius: 100%;
        }
        .record-title {
          span {
            color: rgba(255, 255, 255, 0.7);
          }
        }
        .note {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
        }
        .description {
          max-width: 250px;
          white-space: break-spaces;
        }
      }
    }
  }
`;

export const StyledIdoStatus = styled(Badge)`
  &.upcoming {
    color: #ff7e21;
    background-color: rgba(255, 126, 33, 0.2);
    padding: 6px 12px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
  }
  &.crowing-funding {
    color: rgba(51, 133, 255, 1);
    background-color: rgba(51, 133, 255, 0.2);
    padding: 6px 12px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
  }
  &.finished {
    color: rgba(4, 197, 127, 1);
    background-color: rgba(4, 197, 127, 0.2);
    padding: 6px 12px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
  }
  &.ending {
    color: rgba(255, 71, 71, 1);
    background-color: rgba(255, 71, 71, 0.2);
    padding: 6px 12px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
  }
`;
