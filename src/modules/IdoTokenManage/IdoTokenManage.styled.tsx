import { colors } from '@/theme/colors';
import { Box } from '@chakra-ui/react';
import styled from 'styled-components';

export const StyledIdoManage = styled(Box)`
  h6 {
    color: white;
    text-align: center;
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
    color: rgba(28, 28, 28, 1);
  }

  .filterContainer {
    width: 400px;
    border: 1px solid rgba(236, 236, 237, 1);
    height: 60px;
    .chakra-text {
      color: #1c1c1c;
    }
    .select-placeholder {
      color: #898989 !important;
      font-weight: 500;
      font-size: 16px;
    }
  }
  .chakra-input__group,
  .field-calendar-container {
    border-radius: 0px;
    background-color: transparent;
    border: 1px solid rgba(236, 236, 237, 1);
    height: 60px;

    input {
      color: #1c1c1c;
      border-radius: 0;
      border: none;
      font-weight: 500;
      font-size: 16px;
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
    background: #ffffff;
    box-shadow: 0px 4px 24px 8px rgba(0, 0, 0, 0.08);
    border-radius: 12px;
    padding: 24px;
    width: 350px;

    h6 {
      color: #1c1c1c;
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
`;
