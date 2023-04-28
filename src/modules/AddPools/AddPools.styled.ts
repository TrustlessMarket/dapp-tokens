import styled from 'styled-components';
import { StyledPools } from '../Pools/Pools.styled';
import px2rem from '@/utils/px2rem';

export const StyledAddPool = styled(StyledPools)`
  .form-header {
    display: flex;
    align-items: center;
    gap: ${px2rem(10)};
    border-bottom: 1px solid rgb(232, 236, 251);
    padding-bottom: ${px2rem(10)};
    .title {
      color: black;
      font-size: ${px2rem(20)};
    }
  }

  .form-wrap {
    margin-top: ${px2rem(10)};
    label {
      font-weight: 500;
      font-size: ${px2rem(14)};
      margin-bottom: ${px2rem(5)};
    }
    .row {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: ${px2rem(10)};
      margin-bottom: ${px2rem(15)};
    }
  }

  .btn-confirm {
    width: 100%;
    min-height: 40px;
    background: #00c6ff;
    color: #ffffff;
    margin-top: ${px2rem(20)};
  }

  .fee-note {
    color: black;
    margin-top: ${px2rem(5)};
  }
`;
