import icBack from '@/assets/icons/ic-arrow-left.svg';
import Text from '@/components/Text';
import Layout from '@/layouts';
import Image from 'next/image';
import { StyledPoolFormContainer } from '../Pools/Pools.styled';
import { StyledAddPool } from './AddPools.styled';
import { ROUTE_PATH } from '@/constants/route-path';
import FormAddPoolContainer from './form';

const AddPoolIndex = () => {
  return (
    <>
      <Layout>
        <StyledAddPool>
          <div className="background" />
          <StyledPoolFormContainer>
            <div className="form-header">
              <a href={ROUTE_PATH.POOLS}>
                <Image src={icBack} width={24} height={24} alt="icon" />
              </a>
              <Text className="title">Add liquidity</Text>
            </div>
            <FormAddPoolContainer />
          </StyledPoolFormContainer>
        </StyledAddPool>
      </Layout>
    </>
  );
};

export default AddPoolIndex;
