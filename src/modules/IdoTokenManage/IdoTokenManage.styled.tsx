import BodyContainer from '@/components/Swap/bodyContainer';
import { colors } from '@/theme/colors';
import px2rem from '@/utils/px2rem';
import styled from 'styled-components';

export const StyledIdoManage = styled(BodyContainer)`
  margin: ${px2rem(25)} auto;
  max-width: 1028px;
  > div {
    height: 100%;
  }
  h6 {
    color: white;
    text-align: center;
    span {
      color: orange;
    }
  }
  .form-container {
    background-color: ${colors.darkBorderColor};
    border-radius: 8px;
    padding: 15px 20px;
    margin-top: ${px2rem(25)};
    .btn-submit {
      width: 100%;
    }
  }

  label {
    color: ${colors.white500};
  }

  .filterContainer {
    border: 1px solid ${colors.white500};
    height: 50px;
    .chakra-text {
      color: ${colors.white};
    }
    .select-placeholder {
      color: ${colors.white500}!important;
    }
  }
  .chakra-input__group,
  .field-calendar-container {
    border-radius: 0px;
    background-color: transparent;
    border: 1px solid ${colors.white500};
    input {
      color: ${colors.white};
      border-radius: 0;
      border: none;
    }
    > div {
      background-color: inherit;
    }
  }

  .token-info {
    display: flex;
    flex-direction: column;
    align-items: center;

    h6 {
      color: ${colors.white};
      text-align: center;
      margin-bottom: 15px;
    }

    img {
      border-radius: 100%;
      width: 50px;
      height: 50px;
    }

    p {
      color: ${colors.white};
      margin-top: 10px;
    }
    .token-socials {
      margin-top: 10px;
    }
  }
`;
