import px2rem from '@/utils/px2rem';
import styled from 'styled-components';

export const StyledPools = styled.div`
  margin-top: ${px2rem(48)};
  margin-left: auto;
  margin-right: auto;
  padding-left: 20%;
  padding-right: 20%;

  .background {
    background: linear-gradient(180deg, #00c6ff 0%, #ffffff 100%);
    min-height: 100vh;
    position: absolute;
    width: 100%;
    top: 80px;
    left: 0;
    z-index: -1;
  }

  .title_container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: ${px2rem(12)};
    gap: ${px2rem(12)};
  }

  .upload_title {
    width: fit-content;
    position: relative;
    color: white;
    font-size: ${px2rem(32)};
    line-height: 48 / 44;
  }

  .button-text {
    font-family: var(--font-heading) !important;
    padding: ${px2rem(5)} ${px2rem(12)};
  }
`;

export const StyledPoolFormContainer = styled.div`
  background: #fff;
  padding: ${px2rem(15)} ${px2rem(20)};
  border-radius: ${px2rem(8)};
  box-shadow: 0px 0px 24px -6px rgba(0, 0, 0, 0.12);
`;
