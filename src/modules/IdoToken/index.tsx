/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Flex, Text } from '@chakra-ui/react';
import { StyledIdoContainer } from './IdoToken.styled';
import FiledButton from '@/components/Swap/button/filedButton';
import { BsPlusLg } from 'react-icons/bs';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { ROUTE_PATH } from '@/constants/route-path';

const IdoTokenContainer = () => {
  const router = useRouter();
  const [data, setData] = useState<any[]>();

  return (
    <StyledIdoContainer>
      <Text as={'h1'} className="title">
        Upcoming <span>IDO</span> List
      </Text>

      <Box className="content">
        <Flex mb={4} justifyContent={'flex-end'}>
          <FiledButton onClick={() => router.push(ROUTE_PATH.IDO_MANAGE)}>
            <BsPlusLg style={{ fontWeight: 'bold', color: 'white' }} />
            <Text ml={1}>Create IDO Token</Text>
          </FiledButton>
        </Flex>
      </Box>
    </StyledIdoContainer>
  );
};

export default IdoTokenContainer;
