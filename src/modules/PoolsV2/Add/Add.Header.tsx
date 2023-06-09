import React from 'react';
import s from './styles.module.scss';
import { Flex, Heading, Icon, IconButton } from '@chakra-ui/react';
import { BiChevronLeft } from 'react-icons/bi';
import { ROUTE_PATH } from '@/constants/route-path';
import { useRouter } from 'next/router';
import AddHeaderSwitchPair from './Add.Header.SwitchPair';
import PoolsV2Settings from '../PoolsV2.Settings';

const AddHeader = () => {
  const router = useRouter();
  return (
    <Flex className={s.container__top_body}>
      <IconButton
        position={'absolute'}
        left={0}
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
            fontSize={'30px'}
          />
        }
        onClick={() => router.replace(`${ROUTE_PATH.POOLS_V2}`)}
        aria-label={''}
      />
      <Heading as={'h4'}>Add Liquidity</Heading>
      <Flex className={s.container__top_body__right}>
        <AddHeaderSwitchPair />
        <PoolsV2Settings />
      </Flex>
    </Flex>
  );
};

export default AddHeader;
