import px2rem from '@/utils/px2rem';
import styled, { DefaultTheme } from 'styled-components';

export const StyledTokens = styled.div`
  padding-top: ${px2rem(48)};
  padding-bottom: ${px2rem(48)};

  .upload_title {
    margin-bottom: ${px2rem(24)};
    margin-left: auto;
    margin-right: auto;
    width: fit-content;
    z-index: 1;
    position: relative;
    color: white;
    font-size: ${px2rem(32)};
  }
`;

export const UploadFileContainer = styled.div`
  position: relative;
  z-index: 1;
  max-width: ${px2rem(600)};
  margin-left: auto;
  margin-right: auto;
  padding: ${px2rem(24)} ${px2rem(32)};
  // background-color: ${({ theme }: { theme: DefaultTheme }) => theme.bg2};
  background-color: #1E1E22;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${px2rem(30)};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.text1};
  text-align: center;
  border-radius: ${px2rem(16)};
  //box-shadow: 0px 0px 24px -6px rgba(0, 0, 0, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.1);

  .upload_left {
    display: flex;
    gap: ${px2rem(20)};
    align-items: center;
    flex: 1;
    width: 100%;
  }

  .avatar {
    object-fit: cover;
    width: ${px2rem(30)};
    height: ${px2rem(30)};
    border-radius: 50%;
  }
  .dot-line {
    border: none;
    border-top: 2px dotted #FFFFFF;
    height: 2px;
    width: 100%;
  }
  .router-text {
    background-image: linear-gradient(90deg, rgb(33, 114, 229) 0%, rgb(84, 229, 33) 163.16%);
    background-clip: text;
    -webkit-text-fill-color: transparent;
    -webkit-background-clip:text;
    font-size: 14px;
    font-weight: 500;
  }
`;
