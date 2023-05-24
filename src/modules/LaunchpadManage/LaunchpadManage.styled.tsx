import BodyContainer from '@/components/Swap/bodyContainer';
import { colors } from '@/theme/colors';
import { px2rem } from '@trustless-computer/dapp-core';
import styled from 'styled-components';

export const StyledLaunchpadManage = styled(BodyContainer)`
  padding: ${px2rem(60)};

  h4 {
    color: white;
    text-align: center;
    margin-bottom: ${px2rem(30)};
    span {
      color: orange;
    }
  }
  .form-container {
    .btn-submit {
      width: 100%;
    }
  }

  label {
    color: ${colors.white500};
  }

  .filterContainer {
    width: 100%;
    border: 1px solid ${colors.darkBorderColor};
    height: 60px;
    .chakra-text {
      color: ${colors.white};
    }
    .select-placeholder {
      color: ${colors.white500} !important;
      font-weight: 500;
      font-size: 16px;
    }
  }
  .chakra-input__group,
  .field-calendar-container {
    border-radius: 0px;
    background-color: transparent;
    border: 1px solid ${colors.darkBorderColor};
    height: 60px;
    position: unset;

    input {
      color: ${colors.white};
      border-radius: 0;
      border: none;
      font-weight: 500;
      font-size: 16px;
      height: 100%;
      &::placeholder {
        color: #898989 !important;
        font-weight: 500;
      }
    }
    > div {
      background-color: inherit;
    }
  }

  .token-info {
    display: flex;
    flex-direction: column;
    background: ${colors.darkBorderColor};
    box-shadow: 0px 4px 24px 8px ${colors.dark};
    border-radius: 12px;
    padding: 24px;
    min-width: 350px;

    h6 {
      color: ${colors.white};
      font-weight: 500;
      font-size: 18px;
      line-height: 28px;
      text-align: left;
    }

    img {
      border-radius: 100%;
      width: 80px;
      height: 80px;
      border: 1px solid rgba(0, 0, 0, 0.08);
      margin: 16px 0px;
    }

    p {
      color: ${colors.white};
      margin-top: 10px;
    }

    .horizontal-item {
      div {
        :first-child {
          color: ${colors.white500};
        }
        :last-child {
          color: ${colors.white};
        }
      }
    }

    .token-socials {
      margin-top: 10px;
    }

    .btn-update-info {
      background-color: #f7f7fa;
      border-radius: 8px;
      border: none;
      padding: 16px;
      height: 40px;
      color: #1c1c1c;
    }
  }
  .append-input {
    border-left: 1px solid ${colors.darkBorderColor};
    height: 100%;
    padding-left: ${px2rem(12)};
    padding-right: ${px2rem(8)};
    align-items: center;
  }
`;
