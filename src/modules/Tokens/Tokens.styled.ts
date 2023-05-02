import px2rem from '@/utils/px2rem';
import styled from 'styled-components';

export const StyledTokens = styled.div`
  margin-top: ${px2rem(48)};
  .background {
    background-color: rgb(28, 28, 28);
    min-height: ${px2rem(203)};
    position: absolute;
    width: 100%;
    height: 202px;
    top: 80px;
    left: 0;
    z-index: 0;
    background-repeat: no-repeat;
    background-position: 50% 50%;
  }

  .table {
    th:first-of-type {
      max-width: ${px2rem(50)};
      white-space: nowrap;
    }

    th:nth-child(4),
    td:nth-child(4),
    th:nth-child(5),
    td:nth-child(5) {
      //text-align: right;
    }

    td {
      padding-top: ${px2rem(26)};
      padding-bottom: ${px2rem(26)};
    }
    
    .tableHead {
      &_item {
        color: #FFFFFF;
      }
    }
    
    .tableData {
      &_item {
        color: #FFFFFF;
        
        .increase {
          color: #16c784;
        }
        
        .descrease {
          color: #ea3943;
        }
      }
    }
  }

  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .upload_title {
    margin-bottom: ${px2rem(24)};
    margin-left: auto;
    margin-right: auto;
    width: fit-content;
    z-index: 1;
    position: relative;
    color: white;
    font-size: ${px2rem(48)};
    line-height: 48 / 44;
  }
`;

export const UploadFileContainer = styled.div`
  position: relative;
  z-index: 1;
 // max-width: ${px2rem(800)};
  margin-left: auto;
  margin-right: auto;
  padding: ${px2rem(24)} ${px2rem(32)};
  background-color: rgb(50, 53, 70);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${px2rem(40)};
  color: white;
  text-align: center;

  .upload_left {
    display: flex;
    gap: ${px2rem(20)};
    align-items: center;
    flex: 1;
    margin-bottom: ${px2rem(24)};
  }

  .upload_right {
    position: relative;
    overflow: hidden;
  }

  .button-text {
    font-family: var(--font-heading) !important;
    padding: ${px2rem(11)} ${px2rem(36)};

  }
  .button-create-box{
    margin-right: 30px;
  }
  .brc20-text {
    font-family: var(--font-heading) !important;
    padding: ${px2rem(11)} ${px2rem(36)};
  }
  .comming-soon-text{
    font-family: var(--font-heading) !important;
    padding-bottom:${px2rem(7)};
    line-height: 100%;
  }

  .file-uploader {
    opacity: 0;
    position: absolute;
    width: ${px2rem(150)};
    top: 0;
  }
  .token-table{
    text-align: center;
  }
  .comming-soon-btn{
    margin-left: 10px;
    vertical-align:top;
  }
  .upload_text{
    font-size: 1.5rem;
  }

`;
