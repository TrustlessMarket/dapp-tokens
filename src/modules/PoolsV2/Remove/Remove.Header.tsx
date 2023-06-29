import React from 'react';
import s from './styles.module.scss';
import {Flex, Heading, Icon, IconButton} from '@chakra-ui/react';
import {BiChevronLeft} from 'react-icons/bi';
import {useRouter} from 'next/router';

const RemoveHeader = () => {
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
        onClick={() => router.back()}
        aria-label={''}
      />
      <Heading as={'h4'}>Remove Liquidity</Heading>
      <Flex className={s.container__top_body__right}>
      </Flex>
    </Flex>
  );
};

export default RemoveHeader;
