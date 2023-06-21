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

  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .upload_title {
    /* margin-bottom: ${px2rem(48)}; */
    margin-left: auto;
    margin-right: auto;
    width: fit-content;
    z-index: 1;
    position: relative;
    color: white;
    font-size: ${px2rem(48)};
  }

  .tokens-list {
    overflow: hidden !important;
    .chakra-table {
      border-collapse: separate;
      border-spacing: 0px 4px;
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
            background: #1e1e22;
            text-transform: uppercase;
            //border-bottom-color: #EDF2F7;
            padding-top: ${px2rem(12)};
            padding-bottom: ${px2rem(12)};
            @media screen and (max-width: 758px) {
              padding: ${px2rem(14.5)} ${px2rem(8)}!important;
              text-transform: capitalize !important;
              font-weight: 400;
              &:first-child {
                & > div {
                  justify-content: flex-start;
                }
              }
              &:last-child {
                & > div {
                  justify-content: flex-end;
                }
              }
            }
          }
        }
      }
    }
    @media screen and (max-width: 768px) {
      .chakra-table {
        table-layout: fixed;
        .wrap-icons {
          position: relative;
          min-width: 37.5px;
          img {
            &:last-child {
              position: absolute;
              top: 0;
              right: 0;
            }
          }
        }
      }
    }
  }

  .avatar {
    object-fit: cover;
    width: ${px2rem(25)};
    height: ${px2rem(25)};
    border-radius: 50%;
  }

  .avatar2 {
    object-fit: cover;
    width: ${px2rem(15)};
    height: ${px2rem(15)};
    border-radius: 50%;
  }

  .btn-wrap {
  }
`;

export const UploadFileContainer = styled.div`
  position: relative;
  z-index: 1;
  margin-top: ${px2rem(10)};
  margin-left: auto;
  margin-right: auto;
  padding: ${px2rem(24)} ${px2rem(24)};
  background-color: #1e1e22;
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
  background-color: #1e1e22;
  z-index: 1;
  padding: ${px2rem(24)};
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  position: relative;
  margin-bottom: ${px2rem(40)};
  .title {
    font-size: ${px2rem(20)};
    color: #00aa6c;
    font-weight: 500;
    margin-bottom: 5px;
  }
  .desc {
    color: #ffffff;
    font-size: ${px2rem(16)};
  }

  @media screen and (max-width: 768px) {
    .title {
      font-size: ${px2rem(16)};
    }
    .desc {
      font-size: ${px2rem(14)};
      line-height: 18px;
    }
  }
`;
