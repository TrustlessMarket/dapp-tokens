import React from 'react';
import { StyledPoolFormContainer, StyledPools } from './Pools.styled';
import Button from '@/components/Button';
import Text from '@/components/Text';
import { useRouter } from 'next/router';
import { ROUTE_PATH } from '@/constants/route-path';

const PoolsIndex = () => {
  const router = useRouter();

  const onOpenNewPools = () => {
    return router.push(ROUTE_PATH.ADD_POOL);
  };

  return (
    <StyledPools>
      <div className="background"></div>
      <div className="title_container">
        <h3 className="upload_title">Pools</h3>
        <Button bg={'white'} background={'blue'} onClick={onOpenNewPools}>
          <Text
            size="medium"
            color="bg1"
            className="button-text"
            fontWeight="medium"
          >
            + New
          </Text>
        </Button>
      </div>
      <StyledPoolFormContainer></StyledPoolFormContainer>
    </StyledPools>
  );
};

export default PoolsIndex;
