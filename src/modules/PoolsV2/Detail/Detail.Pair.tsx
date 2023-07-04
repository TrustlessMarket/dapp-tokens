/* eslint-disable @typescript-eslint/no-explicit-any */
import HorizontalItem from '@/components/Swap/horizontalItem';
import { formatCurrency, getTokenIconUrl } from '@/utils';
import { Avatar, Box, Flex, Text } from '@chakra-ui/react';
import s from './styles.module.scss';

const DetailPair = ({ amountValues, tickRange, tokenA, tokenB }: any) => {
  return (
    <Box className={s.container__body__pair}>
      <HorizontalItem
        label={
          <Flex alignItems={'center'} gap={2}>
            <Avatar size={'xs'} src={getTokenIconUrl(tokenA)} />
            <Text>{tokenA.symbol}</Text>
          </Flex>
        }
        value={
          <Flex alignItems={'center'} gap={2}>
            <Text>{formatCurrency(amountValues[0])}</Text>
            {tickRange && (
              <Box className={s.container__percent}>{tickRange.percents[0]}</Box>
            )}
          </Flex>
        }
      />
      <HorizontalItem
        label={
          <Flex alignItems={'center'} gap={2}>
            <Avatar size={'xs'} src={getTokenIconUrl(tokenB)} />
            <Text>{tokenB.symbol}</Text>
          </Flex>
        }
        value={
          <Flex alignItems={'center'} gap={2}>
            <Text>{formatCurrency(amountValues[1])}</Text>
            {tickRange && (
              <Box className={s.container__percent}>{tickRange.percents[1]}</Box>
            )}
          </Flex>
        }
      />
    </Box>
  );
};

export default DetailPair;
