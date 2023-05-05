import px2rem from '@/utils/px2rem';
import styled, { DefaultTheme } from 'styled-components';

export const StyledTokens = styled.div`
  padding-top: ${px2rem(48)};
  padding-bottom: ${px2rem(48)};

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
  max-width: ${px2rem(600)};
  margin-left: auto;
  margin-right: auto;
  padding: ${px2rem(24)} ${px2rem(32)};
  background-color: ${({ theme }: { theme: DefaultTheme }) => theme.bg2};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${px2rem(30)};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.text1};
  text-align: center;
  border-radius: ${px2rem(12)};
  box-shadow: 0px 0px 24px -6px rgba(0, 0, 0, 0.12);

  .upload_left {
    display: flex;
    gap: ${px2rem(20)};
    align-items: center;
    flex: 1;
    width: 100%;
  }
`;
