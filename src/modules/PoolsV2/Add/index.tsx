/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import BodyContainer from '@/components/Swap/bodyContainer';
import { ROUTE_PATH } from '@/constants/route-path';
import { IPoolV2AddPair } from '@/pages/pools/v2/add/[...id]';
import { Box, Flex, Heading, Icon, IconButton } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import { Form } from 'react-final-form';
import { BiChevronLeft } from 'react-icons/bi';
import FormAddPoolsV2Container from './form';
import s from './styles.module.scss';

type IPoolsV2AddPage = IPoolV2AddPair;

const PoolsV2AddPage: React.FC<IPoolsV2AddPage> = ({ ids }) => {
  const router = useRouter();

  const onSubmit = async (values: any) => {
    console.log('values', values);

    try {
    } catch (error) {
    } finally {
    }
  };

  return (
    <BodyContainer className={s.container}>
      <Box className={s.container__body}>
        <Flex className={s.container__top_body}>
          <IconButton
            position={'absolute'}
            left={0}
            size={'sm'}
            borderWidth={0}
            colorScheme="whiteAlpha"
            variant="outline"
            _hover={{
              backgroundColor: 'transparent',
            }}
            icon={
              <Icon
                as={BiChevronLeft}
                color={'rgba(255, 255, 255, 0.5)'}
                fontSize={'25px'}
              />
            }
            onClick={() => router.replace(`${ROUTE_PATH.POOLS_V2}`)}
            aria-label={''}
          />
          <Heading as={'h4'}>Add Liquidity</Heading>
        </Flex>
        <Box className={s.container__content_body}>
          <Form onSubmit={onSubmit}>
            {({ handleSubmit }) => (
              <FormAddPoolsV2Container handleSubmit={handleSubmit} ids={ids} />
            )}
          </Form>
        </Box>
      </Box>
    </BodyContainer>
  );
};

export default PoolsV2AddPage;
