import px2rem from '@/utils/px2rem';
import styled, { DefaultTheme } from 'styled-components';

export const StyledTokens = styled.div`
  margin-top: ${px2rem(48)};

  .table {
    th:first-of-type {
      max-width: ${px2rem(50)};
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
  }

  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const UploadFileContainer = styled.div`
  padding: ${px2rem(24)} ${px2rem(32)};
  background-color: ${({ theme }: { theme: DefaultTheme }) => theme.bg2};
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${px2rem(40)};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.white};

  .upload_left {
    display: flex;
    gap: ${px2rem(20)};
    align-items: center;
    flex: 1;
  }

  .upload_right {
    position: relative;
    overflow: hidden;
  }

  .upload_title {
    margin-bottom: ${px2rem(8)};
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
`;
