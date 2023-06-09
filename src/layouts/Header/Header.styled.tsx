import Button from '@/components/Button';
import px2rem from '@/utils/px2rem';
import { Tooltip } from 'react-bootstrap';
import styled, { DefaultTheme } from 'styled-components';
import Link from 'next/link';

const Wrapper = styled.div`
  /* max-width: 1920px; */
  background: #0f0f0f;
  //border-bottom: 1px solid #353945;

  .header-container {
    padding: 0px 3.75rem;
    //height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    position: relative;
    gap: ${px2rem(20)};

    @media screen and (max-width: 767px) {
      overflow-x: auto;
      padding: 0 ${px2rem(16)};
    }
  }

  .logo {
    z-index: 999;
    max-width: ${px2rem(40)};
    min-width: ${px2rem(40)};
  }

  a {
    text-decoration: unset;
  }

  .rowLink {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: ${px2rem(32)};
    position: absolute;
    left: 50%;
    transform: translateX(-47%);
  }

  .leftWrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: ${px2rem(32)};
  }

  .leftContainer {
    color: #3385ff;

    .external-link {
      color: inherit;
    }
  }

  .rightContainer {
    color: #ffffff;

    .external-link {
      color: inherit;
    }
  }

  .leftContainer,
  .rightContainer {
    //color: #3385ff;

    display: flex;
    flex-direction: row;
    align-items: center;
    gap: ${px2rem(12)};
    position: relative;

    .external-link {
      display: flex;
      align-items: center;
      gap: ${px2rem(24)};
      margin-right: ${px2rem(24)};
      text-transform: uppercase;
      font-size: ${px2rem(16)};
      font-weight: 500;

      a:hover {
        text-decoration: none;
      }

      .isSelected {
        border-bottom: 2px solid #3385ff;
      }
    }

    @media screen and (min-width: 1024px) {
      :hover {
        .dropdown {
          display: block;
          z-index: 9;
        }
      }
    }

    .btnMenuMobile {
      width: 30px;
      height: 30px;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .dropdown {
    position: absolute;
    overflow: hidden;
    right: 0;
    top: 100%;
    padding-top: ${px2rem(10)};
    width: ${px2rem(200)};
    display: none;

    .dropdownMenuItem {
      background: ${({ theme }: { theme: DefaultTheme }) => theme.primary[333]};
      color: ${({ theme }: { theme: DefaultTheme }) => theme.white};
      padding: ${px2rem(10)} ${px2rem(16)};
      font-weight: normal;
      cursor: pointer;
      width: 100%;
      display: flex;
      justify-content: flex-end;

      :hover {
        background: ${({ theme }: { theme: DefaultTheme }) => theme.primary['5b']};
      }

      :first-child {
        border-top-left-radius: 2px;
        border-top-right-radius: 2px;
      }

      :last-child {
        border-bottom-left-radius: 2px;
        border-bottom-right-radius: 2px;
      }
    }
  }
`;

const StyledLink = styled(Link)<{ active: boolean; activeColor?: string }>`
  cursor: pointer;
  font-weight: 400;
  font-size: ${px2rem(16)};
  line-height: ${px2rem(28)};
  text-decoration: none !important;
  color: ${({
    theme,
    active,
    activeColor,
  }: {
    theme: DefaultTheme;
    active: boolean;
    activeColor?: string;
  }) => (active ? activeColor || theme.white : theme.text2)};
  font-family: var(--font-heading);
  letter-spacing: -0.02em;

  :hover {
    color: ${({ theme }: { theme: DefaultTheme }) => theme.white};
    opacity: 0.7;
  }
`;

const Anchor = styled.a<{ active: boolean }>`
  cursor: pointer;
  font-weight: 400;
  font-size: ${px2rem(16)};
  line-height: ${px2rem(28)};
  text-decoration: none !important;
  color: ${({ theme, active }: { theme: DefaultTheme; active: boolean }) =>
    active ? theme.white : theme.text2};
  font-family: var(--font-heading);
  letter-spacing: -0.02em;

  :hover {
    color: ${({ theme }: { theme: DefaultTheme }) => theme.white};
    opacity: 0.7;
  }
`;

const WalletBalance = styled.div`
  display: flex;
  align-items: center;
  gap: ${px2rem(12)};
  padding: ${px2rem(4)};
  padding-left: ${px2rem(12)};
  border: 1px solid ${({ theme }: { theme: DefaultTheme }) => theme.primary['5b']};
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 40px;
  cursor: pointer;
  transition: all 0.2s ease;

  &.isTokenPage {
    p {
      color: #ffffff;
    }
  }

  &:hover {
    border-color: ${({ theme }: { theme: DefaultTheme }) => theme.primary['d9']};
  }

  .balance {
    display: flex;
    align-items: center;
    gap: ${px2rem(12)};

    .divider {
      width: 1px;
      height: 16px;
      background-color: ${({ theme }: { theme: DefaultTheme }) =>
        theme.primary['5b']};
    }
  }

  .avatar {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const WalletAdress = styled(Tooltip)`
  margin-top: ${px2rem(8)};

  .tooltip-inner {
    background-color: #424242;
    color: white;
    padding: ${px2rem(6)} ${px2rem(16)};
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.15);
    border-radius: 8px;
  }
  .tooltip-arrow::before {
    border-bottom-color: #424242;
  }
`;

const ConnectWalletButton = styled(Button)`
  padding: ${px2rem(8)} ${px2rem(16)};
  color: #1c1c1c;
  font-size: ${px2rem(14)};
  line-height: ${px2rem(24)};
  font-weight: 500;
  background: #ffffff;
  text-transform: uppercase;
  border-radius: 8px !important;
  letter-spacing: 0.01em;

  :disabled {
    opacity: 0.8;
  }
`;

export {
  ConnectWalletButton,
  Wrapper,
  StyledLink,
  WalletBalance,
  WalletAdress,
  Anchor,
};
