import { colors } from '@/theme/colors';
import px2rem from '@/utils/px2rem';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;
  transform: translateX(100%);

  .inner {
    background-color: ${colors.dark};
    width: 100vw;
    height: 100vh;
    gap: ${px2rem(8)};
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    padding-top: ${px2rem(20)};
    padding-right: 16px;
  }

  .btnMenuMobile {
    margin-top: 8px;

    img {
      width: 24px;
      height: 24px;
    }
  }

  .social {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: ${px2rem(8)};
    margin-top: ${px2rem(8)};

    .icon {
      width: ${px2rem(34)};
      height: ${px2rem(34)};
      cursor: pointer;

      :hover {
        opacity: 0.8;
      }
    }
  }

  .content {
    width: 100%;
    height: 100%;
    .menu-container {
      a {
        display: flex;

        margin: 16px;
        padding-bottom: 16px;
        border-bottom: 1px solid #353945;

        font-size: 16px;
        font-weight: 500;
        line-height: 28px;
        letter-spacing: -0.01em;
        text-align: left;
        text-transform: uppercase;
        align-items: center;
        justify-content: space-between;
        color: #ffffff;
      }
    }
  }
`;

export { Wrapper };
