import px2rem from '@/utils/px2rem';
import styled from 'styled-components';

export const FieldWrapper = styled.div`
  flex: 1;
  width: 100%;
  .btn-wrapper {
    .select__control {
      padding: ${px2rem(6)} ${px2rem(12)};
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: ${px2rem(4)};
      width: 100%;
      box-shadow: rgba(0, 0, 0, 0.075) 0px 6px 10px;
    }

    .select__value-container {
      padding-left: 0px;
    }

    label {
      margin-bottom: 0;
      &.select-placeholder {
        opacity: 0.7;
      }
    }
  }

  .form-input {
    padding: 0.375rem 0.75rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.25rem;
    width: 100%;
    box-shadow: rgba(0, 0, 0, 0.075) 0px 6px 10px;
    border: 1px solid hsl(0, 0%, 80%);
    border-radius: 4px;
    min-height: 50px;
  }
`;
