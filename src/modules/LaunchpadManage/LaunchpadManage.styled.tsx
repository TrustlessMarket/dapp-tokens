import BodyContainer from '@/components/Swap/bodyContainer';
import { colors } from '@/theme/colors';
import { Box, Flex, Popover } from '@chakra-ui/react';
import { px2rem } from '@trustless-computer/dapp-core';
import styled from 'styled-components';

export const StyledLaunchpadManage = styled(BodyContainer)`
  padding: 0px ${px2rem(60)};
  padding-bottom: ${px2rem(30)};
  & > div {
    padding: 0px;
  }

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
      color: ${colors.white}!important;
      border-radius: 0;
      border: none;
      font-weight: 500;
      font-size: 16px;
      height: 100%;
      &:disabled {
        color: ${colors.white500}!important;
      }
      &::placeholder {
        color: #898989 !important;
        font-weight: 500;
      }
    }
    > div {
      background-color: inherit;
    }
  }

  .append-input {
    border-left: 1px solid ${colors.darkBorderColor};
    height: 100%;
    padding-left: ${px2rem(12)};
    padding-right: ${px2rem(8)};
    align-items: center;
  }

  .image-drop-container {
    overflow: hidden;
    border: 1px dashed ${colors.darkBorderColor};
    .dropzone {
      background-color: ${colors.dark};
      color: ${colors.white500};
    }
  }

  .item-faq-container {
    flex: 1;
    margin-bottom: 25px;
    &.cls-textarea {
      .chakra-input__group {
        height: unset;
        min-height: 60px;
        border: none;
        textarea {
          height: 60px;
          background-color: transparent;
          border: 1px solid #353945;
          color: white !important;
          border-radius: 0;
          padding-top: 5px;
          margin-top: 5px;
        }
      }
    }
    input {
      background-color: transparent;
    }
  }

  .btn-add-faq {
    color: ${colors.white};
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    width: 140px !important;
    min-width: 140px !important;
    svg {
      margin-right: 3px;
    }
  }

  .btn-remove {
    background: rgba(255, 71, 71, 0.2);
    border-radius: 4px;
    color: #ff4747;
    font-style: normal;
    font-weight: 500;
    font-size: ${px2rem(10)}!important;
    line-height: 16px;
    min-width: 63px !important;
    width: 68px !important;
    height: 18px !important;
    margin-left: 12px;
    padding-left: 0;
    padding-right: 0;
    svg {
      margin-right: 5px;
    }
  }

  .btn-secondary {
    background-color: transparent;
    border: 1px solid ${colors.white};
  }
`;

export const StyledLaunchpadManageHeader = styled(Flex)`
  border-width: 0px 1px 1px 1px;
  border-style: solid;
  border-color: #353945;

  padding: ${px2rem(36)} ${px2rem(41)};

  .btn-back-container {
    align-items: center;
    gap: ${px2rem(20)};
    align-items: center;
    flex: 1;
    .back-title {
      color: #ffffff;
      font-style: normal;
      font-weight: 500;
      font-size: ${px2rem(24)};
    }
    .btn-back {
      background-color: transparent;
      border-radius: 6px;
      width: 30px;
      height: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      transition: background-color 0.1s ease-in-out;
      .btn-back-icon {
        font-size: ${px2rem(16)};
        color: ${colors.white};
        transition: color 0.1s ease-in-out;
      }
      &:hover {
        background-color: #ffffff;
        .btn-back-icon {
          color: ${colors.black};
        }
      }
    }
  }

  .step-container {
    flex: 2;

    .step-item {
      gap: 12px;
      flex: unset;
    }

    .step-title {
      color: ${colors.white};
      opacity: 0.4;
      margin-bottom: 0px;
      font-style: normal;
      font-weight: 400;
      font-size: ${px2rem(16)};
      line-height: 140%;
    }

    .step-content {
      justify-content: center;
    }

    .separator {
      margin-inline-start: 0;
      width: 48px;
    }

    [data-status='complete'] {
      .indicator {
        background: rgba(4, 197, 127, 0.2);
        svg {
          color: #04c57f;
        }
      }
      .separator {
        background: ${colors.white100};
      }
      /* .step-title {
        opacity: 1;
        color: ${colors.bluePrimary};
      } */
    }

    [data-status='active'] {
      .indicator,
      .separator {
        background: ${colors.white100};
      }
      .step-title {
        opacity: 1;
        color: ${colors.white};
      }
    }

    [data-status='incomplete'] {
      .indicator,
      .separator {
        background: ${colors.white100};
      }
      .step-title {
        opacity: 0.4;
      }
    }
  }

  .btn-submit-container {
    flex: 1;
  }
`;

export const StyledLaunchpadFormStep1 = styled(Flex)`
  border: 1px solid #353945;
  gap: 24px;
  margin-top: ${px2rem(32)};
  .token-info {
    display: flex;
    flex-direction: column;
    padding: ${px2rem(40)};
    border-left: 1px solid #353945;

    h6 {
      color: ${colors.white};
      font-weight: 500;
      font-size: ${px2rem(18)};
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
      align-items: flex-start;
      div {
        :first-child {
          color: ${colors.white500};
        }
        :last-child {
          > div {
            :first-child {
              color: ${colors.white};
            }
            &.note {
              color: ${colors.white500};
              font-size: ${px2rem(12)};
            }
          }
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
  .fields-left-container {
    padding: ${px2rem(40)};
    padding-right: ${px2rem(20)};
  }
  .fields-right-container {
    padding: ${px2rem(40)};
    padding-left: ${px2rem(20)};
  }

  .liquidity-container {
    gap: ${px2rem(12)};
    .liquidity-item {
      flex: 1;
      border: 1px solid #353945;
      border-radius: 4px;
      align-items: center;
      justify-content: center;
      gap: ${px2rem(8)};
      height: 60px;
      cursor: pointer;
      &.active {
        background: #1e1e22;
        border: 1px solid rgba(255, 255, 255, 0.7);
      }
      img {
        width: 24px;
        height: 24px;
      }
      p {
        font-style: normal;
        font-weight: 500;
        font-size: ${px2rem(16)};
        line-height: 16px;
        /* identical to box height, or 100% */

        text-align: center;

        color: #ffffff;
      }
      &.disabled {
        cursor: default;
      }
    }
  }
  &.step-2-container {
    padding: ${px2rem(40)};
    flex-direction: column;
    .field-container {
      width: 100%;
      .image-drop-container {
        border: 1px dashed #353945;
        border-radius: 4px;
        overflow: hidden;
        .dropzone {
          background: rgba(30, 30, 34, 0.5);
          .img-upload {
            height: 82px;
            width: 92px;
            margin-right: 0px;
            margin-bottom: ${px2rem(12)};
          }
          & > div {
            font-weight: 400;
            br {
              display: none;
            }
          }
        }
        .uploaded {
          flex-direction: column;
          img {
            max-width: 100px;
            height: auto;
            margin-right: 0;
          }
          & > div {
            text-align: center;
            margin-top: 5px;
            button {
              margin: 0 auto;
            }
          }
        }
      }
    }
  }

  .btn-download-template {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 8px 14px 8px 10px;
    gap: 8px;
    justify-content: center;
    align-items: center;
    color: #ffffff;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 24px;
    cursor: pointer;
    &.primary {
      background: ${colors.bluePrimary};
    }
  }

  .summary-information {
    color: ${colors.white500};
    margin-top: ${px2rem(15)};
    font-size: ${px2rem(13)};
    white-space: break-spaces;
    label {
      font-weight: 500;
    }
    b {
      color: ${colors.white};
    }
  }
`;

export const FAQStyled = styled(Box)`
  margin-top: ${px2rem(48)};
  align-self: center;
  border: 1px solid #353945;
  padding: ${px2rem(40)};
  h3 {
    color: ${colors.white};
    text-align: left;
  }
  .faqs-wrapper {
    & > div {
      & > div {
        padding-inline-start: 0;
        padding-inline-end: 0;
        padding-top: 0;
        .chakra-heading {
          color: #ffffff;
        }

        .faq-question {
          color: #ffffff;
        }

        .faq-answer {
          color: rgba(255, 255, 255, 0.7);

          p {
            color: inherit;
          }
          a {
            color: ${colors.bluePrimary};
          }
        }

        .chakra-accordion {
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }

        .chakra-accordion__button {
          background-color: transparent;

          &:hover {
            background-color: transparent;
          }
          &:focus-visible {
            box-shadow: none;
          }
        }

        .chakra-accordion__panel {
          background-color: transparent;
        }
      }
    }
  }
`;

export const BtnNeedHelpStyled = styled(Flex)`
  color: ${colors.black};
  align-items: center;
  justify-content: center;
  background-color: transparent;
  position: fixed;
  bottom: 15px;
  right: 15px;
  z-index: 100;
  border-radius: 8px;
  min-width: 40px;
  min-height: 40px;
  gap: 5px;
  cursor: pointer;
  transition: 200ms ease-in-out;
  p {
    display: none;
  }
  svg {
    font-size: ${px2rem(30)};
    color: white;
  }
  &:hover,
  &:active,
  &:focus,
  &.is-active {
    background-color: white;
    padding-left: ${px2rem(10)};
    padding-right: ${px2rem(5)};
    p {
      display: block;
    }
    svg {
      font-size: ${px2rem(30)};
      color: black;
    }
  }
`;

export const PopoverNeedHelp = styled(Popover)``;
