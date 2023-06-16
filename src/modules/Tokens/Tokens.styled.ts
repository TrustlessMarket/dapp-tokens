import px2rem from '@/utils/px2rem';
import styled from 'styled-components';

export const StyledTokens = styled.div`
  //padding-top: ${px2rem(48)};
  //padding-bottom: ${px2rem(48)};
  padding: ${px2rem(48)} 3.75rem;

  .avatar {
    object-fit: cover;
    width: ${px2rem(40)};
    height: ${px2rem(40)};
    border-radius: 50%;
  }

  .chakra-table__container {
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  .chakra-table {
    th:first-of-type {
      max-width: ${px2rem(50)};
      white-space: nowrap;
      padding-left: ${px2rem(24)};
    }

    th:nth-child(4),
    td:nth-child(4),
    th:nth-child(5),
    td:nth-child(5) {
      //text-align: right;
    }

    td {
      padding-top: ${px2rem(24)};
      padding-bottom: ${px2rem(24)};
    }

    thead {
      tr {
        th {
          background: #1E1E22;
          text-transform: uppercase;
          border-bottom-color: rgba(255, 255, 255, 0.1);
          padding-top: ${px2rem(12)};
          padding-bottom: ${px2rem(12)};
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
          }
        }

        &:hover {
          background-color: #1E1E22;
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
    margin-left: auto;
    margin-right: auto;
    width: fit-content;
    z-index: 1;
    position: relative;
    color: white;
    font-size: ${px2rem(48)};
    line-height: ${px2rem(58)};
    margin-bottom: 0;
    letter-spacing: -0.05em;
  }

  .tokens-list {
    overflow: hidden !important;
  }
  
  .chakra-input__left-element {
    height: 48px;
    width: 48px;
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
  }

  .search_text {
    font-size: ${px2rem(14)};
    color: #ffffff;
    font-weight: 400;
    padding-left: 0;
  }

  @media screen and (max-width: 768px) {
    /* margin-top: ${px2rem(24)}; */

    .upload_title {
      margin-bottom: ${px2rem(16)};
    }
  }
`;

export const UploadFileContainer = styled.div`
  position: relative;
  z-index: 1;
  // max-width: ${px2rem(800)};
  margin-left: auto;
  margin-right: auto;
  padding: ${px2rem(24)} ${px2rem(32)};
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
    gap: ${px2rem(32)};
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
    font-size: 1.5rem;
    letter-spacing: -0.05em;
  }

  @media screen and (max-width: 768px) {
    padding: ${px2rem(24)} ${px2rem(0)};
    .upload_text {
      font-size: 1rem;
    }

    .upload_right {
      display: flex;
      flex-direction: column;
      gap: ${px2rem(16)};
      align-items: center;
    }
  }
`;
