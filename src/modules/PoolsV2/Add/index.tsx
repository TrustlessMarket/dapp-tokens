import BodyContainer from '@/components/Swap/bodyContainer';
import React from 'react';
import s from './styles.module.scss';
import { Box, Flex, Heading, Icon, IconButton } from '@chakra-ui/react';
import { BiChevronLeft } from 'react-icons/bi';

const PoolsV2AddPage = () => {
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
            // onClick={() =>
            //   router.replace(`${ROUTE_PATH.POOLS}?type=${ScreenType.default}`)
            // }
            aria-label={''}
          />
          <Heading as={'h4'}>Add Liquidity</Heading>
        </Flex>
      </Box>
    </BodyContainer>
  );
};

export default PoolsV2AddPage;
