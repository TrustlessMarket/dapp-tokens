import px2rem from '@/utils/px2rem';
import { Popover } from 'react-bootstrap';
import styled from 'styled-components';

export const WalletPopover = styled(Popover)`
  /* background-color: #17171a; */
  border: 1px solid #ececed;
  width: ${px2rem(200)};
  color: ${({ theme }) => theme.black};
  padding: ${px2rem(12)} ${px2rem(20)};
  box-shadow: 0px 0px 24px -6px rgba(0, 0, 0, 0.12);
  border-radius: 4px;

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
    margin-bottom: ${px2rem(16)};
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
    gap: ${px2rem(12)};
    cursor: pointer;
    :hover {
      opacity: 0.6;
    }

    .disconnect-text {
      color: ${({ theme }) => theme.red} !important;
    }
  }

  .wallet-link {
    margin-top: ${px2rem(20)};
    margin-bottom: ${px2rem(20)};
  }

  .divider {
    margin-bottom: ${px2rem(16)};
    background-color: #ececed;
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
