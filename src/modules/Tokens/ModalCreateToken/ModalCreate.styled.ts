import px2rem from '@/utils/px2rem';
import { Modal } from 'react-bootstrap';
import styled, { DefaultTheme } from 'styled-components';

export const StyledModalUpload = styled(Modal)`
  &.modal {
    --bs-modal-color: ${({ theme }) => theme.bg1};
  }

  .modal-content {
    border-radius: 2px;
  }

  .modal-header {
    border-bottom: none;
    padding: 0;
    display: flex;
    justify-content: flex-end;
    padding-top: ${px2rem(18)};
    padding-right: ${px2rem(18)};
  }

  .modal-body {
    padding-top: ${px2rem(7)};
  }

  .modal-footer {
    border-top: none;
  }

  .est-fee {
    margin-top: ${px2rem(20)};
    margin-bottom: ${px2rem(28)};
  }

  .est-fee-options {
    display: flex;
    align-items: center;
    gap: ${px2rem(10)};
  }

  .est-fee-item {
    flex: 1;
    padding: ${px2rem(8)} ${px2rem(16)};
    border: 1px solid #cecece;
    border-radius: 8px;
    display: grid;
    place-items: center;
    text-align: center;
    opacity: 0.6;

    &.active {
      opacity: 1;
      border-color: #3385ff;
      border-width: 2px;
    }

    &:hover {
      cursor: pointer;
      opacity: 1;
    }
  }

  .ext-price {
    color: #3385ff;
    font-size: ${px2rem(14)};
    span {
      font-size: ${px2rem(12)};
    }
  }

  .confirm-btn {
    width: 100%;
    margin-top: ${px2rem(8)};
    background-color: #3385ff;

    .confirm-text {
      padding-top: ${px2rem(11)};
      padding-bottom: ${px2rem(11)};
    }
  }
`;

export const WrapInput = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${px2rem(16)};

  .title-input {
    font-weight: 500;
    font-size: ${px2rem(12)};
    line-height: ${px2rem(20)};
    text-transform: uppercase;
    color: ${({ theme }: { theme: DefaultTheme }) => theme.primary['5b']};
    margin-bottom: ${px2rem(6)};
  }

  .input {
    padding: ${px2rem(11)} ${px2rem(14)};
    font-weight: 400;
    font-size: ${px2rem(16)};
    line-height: ${px2rem(26)};
    border: 1px solid ${({ theme }: { theme: DefaultTheme }) => theme.border3};
    color:black;      

    :hover {
      border: 1px solid
        ${({ theme }: { theme: DefaultTheme }) => theme.primary.brand};
    }
  }

  .error {
    font-weight: 400;
    font-size: ${px2rem(14)};
    line-height: ${px2rem(24)};
    color: ${({ theme }: { theme: DefaultTheme }) => theme.text6};
  }
`;

export const Title = styled.h5`
  margin-bottom: ${px2rem(24)};
  font-weight: 600;
  font-size: ${px2rem(24)};
  line-height: ${px2rem(34)};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.text1};
`;
