import px2rem from '@/utils/px2rem';
import styled, { DefaultTheme } from 'styled-components';

export const StyledTokens = styled.div`
  margin-top: ${px2rem(48)};

  .background {
    background-image: url("imgs/banner5.png");
    min-height: ${px2rem(203)};
    position: absolute;
    width: 100%;
    height: 202px;
    top: 80px;
    left: 0;
    z-index: 0;
  }

  .table {
    th:first-of-type {
      max-width: ${px2rem(50)};
      white-space: nowrap;
    }

    th:nth-child(4),
    td:nth-child(4),
    th:nth-child(5),
    td:nth-child(5) {
      //text-align: right;
    }

    td {
      padding-top: ${px2rem(26)};
      padding-bottom: ${px2rem(26)};
    }
  }

  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .upload_title {
    margin-bottom: ${px2rem(24)};
    margin-left: auto;
    margin-right: auto;
    width: fit-content;
    z-index: 1;
    position: relative;
    color: #3385FF;
    font-size: ${px2rem(48)};
    line-height: 48 / 44;
  }
`;

export const UploadFileContainer = styled.div`
  position: relative;
  z-index: 1;
  max-width: ${px2rem(800)};
  margin-left: auto;
  margin-right: auto;
  padding: ${px2rem(24)} ${px2rem(32)};
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
    margin-bottom: ${px2rem(24)};
  }

  .upload_right {
    position: relative;
    overflow: hidden;
  }

  .button-text {
    font-family: var(--font-heading) !important;
    padding: ${px2rem(11)} ${px2rem(36)};

  }
  .brc20-text {
    font-family: var(--font-heading) !important;
    padding-top: ${px2rem(2)};
    padding-right: ${px2rem(36)};
    padding-left: ${px2rem(36)};
    padding-bottom: 0;
  }
  .comming-soon-text{
    font-family: var(--font-heading) !important;
    padding-bottom:${px2rem(7)};
    line-height: 100%;
  }

  .file-uploader {
    opacity: 0;
    position: absolute;
    width: ${px2rem(150)};
    top: 0;
  }
  .token-table{
    text-align: center;
  }
  .comming-soon-btn{
    margin-left: 10px;
    vertical-align:top;
  }

`;
