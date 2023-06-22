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

  .button-create-box {
    background-color: white;
    color: black;
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
        .avatar {
          position: relative;
          img {
            min-width: 40px;
            min-height: 40px;
          }
          &:hover {
            .update-info {
              display: flex;
            }
          }
          .update-info {
            display: none;
            position: absolute;
            width: 100%;
            height: 100%;
            background-color: #0000007a;
            align-items: center;
            justify-content: center;
            border-radius: 100%;
            animation: ease-in 100ms;
            border: 1px solid #ffffff87;
            svg {
              color: ${colors.white};
            }
            .fade-action {
              position: absolute;
              width: 100%;
              height: 100%;
              border-radius: 100%;
              cursor: pointer;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              z-index: 2;
            }
          }
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

        .liquidity-token {
          font-size: 14px !important;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 100px;
          padding: 2px 4px !important;
          width: max-content;

          > img {
            width: 16px;
            height: 16px;
          }
        }

        .progress-bar {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 100px;
          > div:first-child {
            background: #04c57f;
            border-radius: 100px;
          }
        }
      }
    }
  }
`;

export const StyledIdoStatus = styled(Badge)`
  border-radius: 100px !important;
  position: relative;
  padding: 6px 12px 6px 24px !important;
  font-size: 12px;
  font-weight: 500;

  &::before {
    content: '';
    position: absolute;
    width: 6px;
    height: 6px;
    top: 40%;
    left: 12px;
    border-radius: 50%;
  }

  &.draft,
  &.pending {
    color: #ff7e21;
    background-color: rgba(255, 126, 33, 0.2);

    &::before {
      background: #ff7e21;
    }
  }
  &.voting {
    color: #95a4fc;
    background-color: rgba(149, 164, 252, 0.2);

    &::before {
      background: #95a4fc;
    }
  }
  &.preparelaunching,
  &.launching {
    color: rgba(51, 133, 255, 1);
    background-color: rgba(51, 133, 255, 0.2);

    &::before {
      background: rgba(51, 133, 255, 1);
    }
  }
  &.successful {
    color: rgba(4, 197, 127, 1);
    background-color: rgba(4, 197, 127, 0.2);

    &::before {
      background: rgba(4, 197, 127, 1);
    }
  }
  &.notpassed,
  &.failed,
  &.cancelled,
  &.end {
    color: rgba(255, 71, 71, 1);
    background-color: rgba(255, 71, 71, 0.2);

    &::before {
      background: rgba(255, 71, 71, 1);
    }
  }
`;
