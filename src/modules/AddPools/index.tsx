import icBack from '@/assets/icons/ic-arrow-left.svg';
import Text from '@/components/Text';
import { ROUTE_PATH } from '@/constants/route-path';
import Layout from '@/layouts';
import Image from 'next/image';
import { UploadFileContainer } from '../Pools/Pools.styled';
import { StyledAddPool } from './AddPools.styled';
import FormAddPoolContainer from './form';

const AddPoolIndex = () => {
  return (
    <>
      <Layout>
        <StyledAddPool>
          <div className="background" />
          <UploadFileContainer>
            <div className="form-header">
              <a href={ROUTE_PATH.POOLS}>
                <Image src={icBack} width={24} height={24} alt="icon" />
              </a>
              <Text className="title">Add liquidity</Text>
            </div>
            <FormAddPoolContainer />
          </UploadFileContainer>
        </StyledAddPool>
      </Layout>
    </>
  );
};

export default AddPoolIndex;
