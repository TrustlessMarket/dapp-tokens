import styled from 'styled-components';
import px2rem from '@/utils/px2rem';

export const Wrapper = styled.div`
  background: #3385ff;
  height: 100vh;
  padding: 0 ${px2rem(32)};

  .header {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-top: 27px;
    padding-bottom: 27px;

    .socialContainer {
      margin-left: ${px2rem(24)};
      display: flex;
      align-items: center;
      gap: ${px2rem(12)};
    }
  }

  .mainContent {
    min-height: calc(100vh - 82px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .logo {
      margin-bottom: ${px2rem(36)};
      filter: invert(1);
    }

    .title {
      max-width: 500px;
      font-weight: 400;
      font-size: ${px2rem(32)};
      line-height: ${px2rem(42)};
      color: #fff;
      text-align: center;
      margin-bottom: ${px2rem(12)};
    }

    .desc {
      max-width: 600px;
      font-weight: 400;
      font-size: ${px2rem(18)};
      line-height: ${px2rem(28)};
      color: rgba(255, 255, 255, 0.7);
      text-align: center;
      margin-bottom: ${px2rem(36)};
    }
  }
`;

export const ConnectWalletButton = styled.button`
  background: white;
  padding: ${px2rem(15)} ${px2rem(24)};
  color: #3385ff;
  font-size: ${px2rem(16)};
  line-height: ${px2rem(26)};
  font-weight: 400;
  border-radius: 8px;
  position: relative;

  :disabled {
    opacity: 0.8;
  }
`;
