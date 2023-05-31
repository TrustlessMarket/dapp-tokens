import px2rem from '@/utils/px2rem';
import { Popover } from 'react-bootstrap';
import styled from 'styled-components';

export const WalletPopover = styled(Popover)`
  width: ${px2rem(200)};
  /* color: ${({ theme }) => theme.black};
  padding: ${px2rem(12)} ${px2rem(20)}; */

  background: #17171a;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;

  * {
    color: ${({ theme }) => theme.black} !important;
  }

  .icCopy {
    cursor: pointer;
  }

  .wallet-tc,
  .wallet-btc {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    .address {
      color: #ffffff !important;
      font-style: normal;
      font-weight: 400;
      font-size: ${px2rem(13)};
      line-height: 120%;
    }
  }

  .wallet-item {
    display: flex;
    align-items: center;
    gap: ${px2rem(8)};
  }

  .wallet-link,
  .wallet-disconnect {
    display: flex;
    align-items: center;
    gap: ${px2rem(14)};
    cursor: pointer;
    padding: 20px;
    :hover {
      opacity: 0.6;
    }

    .disconnect-text {
      color: ${({ theme }) => theme.red} !important;
    }
  }

  .wallet-link {
    .label {
      color: #ffffff !important;
      font-style: normal;
      font-weight: 400;
      font-size: ${px2rem(16)};
      line-height: 140%;
    }
  }

  .divider {
    background-color: rgba(255, 255, 255, 0.1);
  }

  &.popover {
    /* display: none; */

    .popover-arrow {
      width: 100%;
      transform: translate(0px, 0px) !important;
    }

    .popover-arrow::after,
    .popover-arrow::before {
      width: 100%;
      border-bottom-color: white !important;
      visibility: hidden;
    }
  }
`;
