import px2rem from '@/utils/px2rem';
import styled from 'styled-components';

export const StyledTokens = styled.div`
  padding: ${px2rem(54)} 3.75rem;

  .power-by {
    margin: 0 auto;
    gap: ${px2rem(12)};
    align-items: center;
    justify-content: center;
    padding: ${px2rem(8)} ${px2rem(16)};
    background-color: #1e1e22;
    border-radius: 100px;
    max-width: max-content;
    margin-bottom: ${px2rem(16)};
    p {
      color: #cecece;
      font-size: ${px2rem(16)};
      font-weight: 400;
    }
    b {
      color: #ffffff;
      font-weight: 400;
    }
  }

  .avatar {
    object-fit: cover;
    width: ${px2rem(40)};
    height: ${px2rem(40)};
    border-radius: 50%;
    @media screen and (max-width: 768px) {
      width: ${px2rem(32)};
      height: ${px2rem(32)};
    }
  }

  .chakra-table__container {
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  .chakra-table {
    @media screen and (max-width: 758px) {
      table-layout: fixed;
    }
    th:first-of-type {
      max-width: ${px2rem(50)};
      white-space: nowrap;
      padding-left: ${px2rem(24)};
    }

    th:nth-child(4),
    td:nth-child(4),
    th:nth-child(5),
    td:nth-child(6) {
      //text-align: right;
    }

    td {
      padding-top: ${px2rem(22)};
      padding-bottom: ${px2rem(22)};
      @media screen and (max-width: 758px) {
        padding-top: ${px2rem(16)};
        padding-bottom: ${px2rem(16)};
      }
    }

    thead {
      tr {
        th {
          background: #1e1e22;
          text-transform: uppercase;
          border-bottom-color: rgba(255, 255, 255, 0.1);
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
            &:nth-child(2) {
              padding-left: 40px !important;
              & > div {
                text-align: center;
                /* justify-content: center; */
              }
            }
          }
        }
      }
    }

    tbody {
      tr {
        td {
          vertical-align: middle;
          border-bottom-color: transparent;

          &:first-of-type {
            padding-left: ${px2rem(24)};
            margin-top: 10px;
          }

          @media screen and (max-width: 758px) {
            padding: ${px2rem(16)} ${px2rem(8)}!important;
            font-weight: 400;
            &:nth-child(2) {
              padding-left: 40px !important;
            }
          }
        }

        &:hover {
          background-color: #1e1e22;
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
    width: fit-content;
    z-index: 1;
    color: white;
    font-size: ${px2rem(48)};
    line-height: ${px2rem(58)};
    margin: 0 auto;
    letter-spacing: -0.5%;
    font-weight: 500;
    @media screen and (max-width: 758px) {
      font-size: ${px2rem(30)};
      line-height: ${px2rem(40)};
    }
  }

  .tokens-list {
    overflow: hidden !important;
  }

  .chakra-input__left-element {
    height: 44px;
    width: 44px;
  }

  .chakra-form-control {
    max-width: ${px2rem(330)};
    min-width: ${px2rem(330)};

    .chakra-input__group {
      background-color: transparent;

      > div {
        background-color: transparent;
      }
    }

    @media screen and (max-width: 768px) {
      max-width: unset;
    }
  }

  .search_text {
    font-size: ${px2rem(14)};
    color: #ffffff;
    font-weight: 400;
    padding-left: 0;
    height: 44px;
  }

  @media screen and (max-width: 768px) {
    padding: ${px2rem(16)} ${px2rem(16)};
  }
`;

export const UploadFileContainer = styled.div`
  position: relative;
  z-index: 1;
  // max-width: ${px2rem(800)};
  margin-left: auto;
  margin-right: auto;
  padding: ${px2rem(16)} ${px2rem(32)} ${px2rem(24)};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${px2rem(40)};
  color: white;
  text-align: center;

  .upload_left {
    display: flex;
    gap: ${px2rem(20)};
    align-items: center;
    flex: 1;
    margin-bottom: ${px2rem(24)};
  }

  .upload_right {
    display: flex;
    position: relative;
    overflow: hidden;
    gap: ${px2rem(12)};
    margin-bottom: ${px2rem(16)};
  }

  .button-text {
    font-family: var(--font-heading) !important;
    padding: ${px2rem(11)} 0;
  }
  .button-create-box {
    //margin-right: 30px;
    min-width: ${px2rem(154)};
  }
  .brc20-text {
    font-family: var(--font-heading) !important;
    padding: ${px2rem(11)} 0;
  }
  .comming-soon-text {
    font-family: var(--font-heading) !important;
    padding-bottom: ${px2rem(7)};
    line-height: 100%;
  }

  .file-uploader {
    opacity: 0;
    position: absolute;
    width: ${px2rem(150)};
    top: 0;
  }
  .token-table {
    text-align: center;
  }
  .comming-soon-btn {
    //margin-left: 10px;
    vertical-align: top;
    min-width: ${px2rem(154)};
  }
  .upload_text {
    font-size: ${px2rem(24)};
    letter-spacing: -0.05em;
  }

  @media screen and (max-width: 768px) {
    padding: ${px2rem(24)} ${px2rem(0)};
    .upload_text {
      font-size: 1rem;
    }

    // .upload_right {
    //   display: flex;
    //   flex-direction: column;
    //   gap: ${px2rem(16)};
    //   align-items: center;
    // }
  }
`;
