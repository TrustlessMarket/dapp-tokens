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
  .title {
    color: white;
    text-align: center;
    span {
      color: orange;
    }
  }
  .form-container {
    background-color: ${colors.white};
    border-radius: 8px;
    padding: 15px 20px;
    margin-top: ${px2rem(25)};
    .btn-submit {
      width: 100%;
    }
  }
`;
