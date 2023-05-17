import px2rem from '@/utils/px2rem';
import { Box } from '@chakra-ui/react';
import styled, { DefaultTheme } from 'styled-components';

export const StyledTokens = styled.div`
  padding-top: ${px2rem(48)};
  padding-bottom: ${px2rem(48)};
  //width: 720px !important;
  //max-width: 640px;
  margin-left: auto;
  margin-right: auto;

  h6 {
    z-index: 2;
    color: white;
  }

  .chakra-table {
    th:first-of-type {
      max-width: ${px2rem(50)};
      white-space: nowrap;
    }

    th:nth-child(4),
    td:nth-child(4),
    th:nth-child(5),
    td:nth-child(5) {
      text-align: right;
    }

    td {
      padding-top: ${px2rem(26)};
      padding-bottom: ${px2rem(26)};
    }

    thead {
      tr {
        th {
          background: #FFFFFF;
          text-transform: uppercase;
          border-bottom-color: #EDF2F7;
          padding-top: ${px2rem(12)};
          padding-bottom: ${px2rem(12)};
        }
      }
    }
  }

  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .upload_title {
    margin-bottom: ${px2rem(48)};
    margin-left: auto;
    margin-right: auto;
    width: fit-content;
    z-index: 1;
    position: relative;
    color: white;
    font-size: ${px2rem(48)};
    line-height: 48 / 44;
  }
`;

export const UploadFileContainer = styled.div`
  position: relative;
  z-index: 1;
  margin-top: ${px2rem(10)};
  margin-left: auto;
  margin-right: auto;
  padding: ${px2rem(12)} ${px2rem(24)};
  background-color: ${({ theme }: { theme: DefaultTheme }) => theme.bg2};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${px2rem(40)};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.text1};
  text-align: center;
  border-radius: ${px2rem(12)};
  box-shadow: 0px 0px 24px -6px rgba(0, 0, 0, 0.12);

  .upload_left {
    display: flex;
    gap: ${px2rem(20)};
    align-items: center;
    flex: 1;
    /* margin-bottom: ${px2rem(24)}; */
    width: 100%;
  }

  .upload_right {
    position: relative;
    overflow: hidden;
  }

  .button-text {
    font-family: var(--font-heading) !important;
    padding: ${px2rem(11)} ${px2rem(36)};
  }

  .file-uploader {
    opacity: 0;
    position: absolute;
    width: ${px2rem(150)};
    top: 0;
  }

  .notOnTdRow {
    td {
      border: none;
      .chakra-accordion__item {
        box-shadow: 0px 0px 10px 0px #0000000a;
      }
    }
  }
`;

export const StyledLiquidNote = styled(Box)`
  background-color: #f5f5f5c9;
  z-index: 1;
  padding: 15px 20px;
  border-radius: 8px;
  position: relative;
  margin-bottom: ${px2rem(30)};
  .title {
    font-weight: bold;
    margin-bottom: 5px;
  }
  .desc {
    font-size: ${px2rem(13)};
  }
`;
