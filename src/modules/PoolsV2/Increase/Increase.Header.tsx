import { Flex, Heading, Icon, IconButton } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { BiChevronLeft } from 'react-icons/bi';
import s from './styles.module.scss';
import PoolsV2Settings from '../PoolsV2.Settings';

const IncreaseHeader = () => {
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
      <Heading as={'h4'}>Add Liquidity</Heading>
      <Flex className={s.container__top_body__right}>
        <PoolsV2Settings />
      </Flex>
    </Flex>
  );
};

export default IncreaseHeader;
