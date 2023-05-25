import { colors } from '@/theme/colors';
import px2rem from '@/utils/px2rem';
import styled from 'styled-components';

export const StyledCollectionsList = styled.div`
  .tabs {
    display: flex;
    align-items: center;
    gap: ${px2rem(24)};
    border-bottom: 1px solid ${colors.darkBorderColor};
    margin-bottom: ${px2rem(20)};

    .tab-name:first-of-type {
      margin-left: ${px2rem(32)};
    }
  }

  .tab-name {
    color: #fff;
    font-size: ${px2rem(16)};
    font-weight: 500;
    text-transform: uppercase;
    padding: ${px2rem(20)} 0;
    opacity: 0.5;

    &.active {
      border-bottom: 2px solid #fff;
      opacity: 1;
    }
  }

  .search {
    display: flex;
    align-items: center;
    gap: ${px2rem(11)};
    padding: ${px2rem(11)} ${px2rem(14)};
    margin: 0 ${px2rem(32)};
    border: 1px solid ${colors.darkBorderColor};
    border-radius: ${px2rem(2)};
    margin-bottom: ${px2rem(20)};

    .input {
      font-weight: 400;
      font-size: ${px2rem(16)};
      line-height: ${px2rem(28)};
      color: #ffffff;
      border: none;
      outline: none;
      padding: 0;
      height: inherit;

      &:focus-visible {
        border: none;
        outline: none;
        box-shadow: none;
      }

      &:disabled {
        opacity: 1;
        color: #b6b6b6;
        background: #f2f2f2;
      }
    }
  }
`;
