import BodyContainer from '@/components/Swap/bodyContainer';
import { colors } from '@/theme/colors';
import px2rem from '@/utils/px2rem';
import styled from 'styled-components';

export const StyledIdoContainer = styled(BodyContainer)`
  margin: ${px2rem(25)} auto;
  max-width: 1366px;
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

  .chakra-table {
    border: 1px solid ${colors.darkBorderColor}!important;
    border-radius: 6px;
    overflow: hidden;
    thead {
      background-color: ${colors.darkBorderColor};
      th {
        padding-top: 8px !important;
        :first-child {
        }
      }
    }
    tbody {
      tr {
        background-color: ${colors.white50};
        :nth-child(even) {
          background-color: ${colors.white100};
        }
      }
      td {
        color: ${colors.white};
        vertical-align: middle;
        img {
          width: 40px;
          height: 40px;
          border-radius: 100%;
        }
        .up-coming {
          color: orange;
          font-size: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 400;
        }
        .desc {
          font-size: 14px;
          color: ${colors.white500};
        }
      }
    }
  }
`;
