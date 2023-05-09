import { IToken } from '@/interfaces/token';
import { formatCurrency } from '@/utils';
import { Box, Flex, Text } from '@chakra-ui/react';
import { StyledTokenTopInfo } from './Token.styled';
import { AiOutlineCaretDown, AiOutlineCaretUp } from 'react-icons/ai';
import { colors } from '@/theme/colors';

const TokenTopInfo = ({ data }: { data: IToken }) => {
  return (
    <StyledTokenTopInfo>
      <Flex gap={4} alignItems={'center'}>
        <img
          src={
            data?.thumbnail ||
            'https://cdn.trustless.computer/upload/1683530065704444020-1683530065-default-coin.svg'
          }
          alt={data?.thumbnail || 'default-icon'}
          className={'avatar'}
        />
        <Box className="block-info">
          <Text className="title">{data.name}</Text>
          <Text className="desc">#{data.index}</Text>
        </Box>
        <Box className="block-info diver-right">
          <Text className="title">
            ${formatCurrency(Number(data.usdPrice || 0).toFixed(18), 18)}
          </Text>
          <Flex alignItems={'center'} gap={1}>
            {Number(data?.percent) > 0 && (
              <AiOutlineCaretUp color={colors.greenPrimary} />
            )}
            {Number(data?.percent) < 0 && (
              <AiOutlineCaretDown color={colors.redPrimary} />
            )}
            <Text
              className="desc"
              style={{
                color:
                  Number(data?.percent) > 0
                    ? colors.greenPrimary
                    : Number(data?.percent) < 0
                    ? colors.redPrimary
                    : colors.white500,
                fontWeight: 'normal',
              }}
            >
              {formatCurrency(data?.percent, 2)}%
            </Text>
          </Flex>
        </Box>
        <Box className="block-info diver-right">
          <Text className="desc">24H %</Text>
          <Text className="desc">24H %</Text>
        </Box>
      </Flex>
    </StyledTokenTopInfo>
  );
};

export default TokenTopInfo;
