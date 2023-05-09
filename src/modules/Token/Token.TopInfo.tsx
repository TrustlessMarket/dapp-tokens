import SocialToken from '@/components/Social';
import FiledButton from '@/components/Swap/button/filedButton';
import { IToken } from '@/interfaces/token';
import { colors } from '@/theme/colors';
import { compareString, formatCurrency } from '@/utils';
import { Box, Flex, Text } from '@chakra-ui/react';
import { AiOutlineCaretDown, AiOutlineCaretUp } from 'react-icons/ai';
import { StyledTokenTopInfo } from './Token.styled';
import { useRouter } from 'next/router';
import { ROUTE_PATH } from '@/constants/route-path';
import { WBTC_ADDRESS } from '../Swap/form';
import { useWeb3React } from '@web3-react/core';

const TokenTopInfo = ({ data }: { data: IToken }) => {
  const router = useRouter();
  const { account } = useWeb3React();

  return (
    <StyledTokenTopInfo>
      <Flex alignItems={'center'}>
        <img
          src={
            data?.thumbnail ||
            'https://cdn.trustless.computer/upload/1683530065704444020-1683530065-default-coin.svg'
          }
          alt={data?.thumbnail || 'default-icon'}
          className={'avatar'}
        />
        <Box className="block-info">
          <Text className="title">
            {data.name} ({data.symbol})
          </Text>
          <Text className="desc">#{data.index}</Text>
        </Box>
        <Flex className="block-info diver-right">
          <Text className="title">
            {formatCurrency(Number(data.btcPrice || 0).toFixed(18), 18)} WBTC
          </Text>
          <Text className="desc">
            ${formatCurrency(Number(data.usdPrice || 0).toFixed(18), 18)}
          </Text>
        </Flex>
        <Flex className="block-info diver-right">
          <Text className="desc">24H %</Text>
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
        </Flex>
        <Flex className="block-info diver-right">
          <Text className="desc">7D %</Text>
          <Flex alignItems={'center'} gap={1}>
            {Number(data?.percent7Day) > 0 && (
              <AiOutlineCaretUp color={colors.greenPrimary} />
            )}
            {Number(data?.percent7Day) < 0 && (
              <AiOutlineCaretDown color={colors.redPrimary} />
            )}
            <Text
              className="desc"
              style={{
                color:
                  Number(data?.percent7Day) > 0
                    ? colors.greenPrimary
                    : Number(data?.percent7Day) < 0
                    ? colors.redPrimary
                    : colors.white500,
                fontWeight: 'normal',
              }}
            >
              {formatCurrency(data?.percent7Day, 2)}%
            </Text>
          </Flex>
        </Flex>
        {/* <Flex className="block-info diver-right">
          <Text className="desc">SUPPLY</Text>
          <Text style={{ color: '#FFFFFF' }} className="desc">
            {formatCurrency(web3.utils.fromWei(data?.totalSupply, 'ether'))}
          </Text>
        </Flex> */}
        <Flex className="block-info">
          <Text className="desc">SOCIALS</Text>
          <SocialToken socials={data.social} />
        </Flex>
      </Flex>
      <Flex
        className="block-info"
        ml={10}
        gap={4}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <FiledButton
          btnSize="h"
          style={{
            color: colors.white,
            fontSize: '16px',
          }}
          onClick={() =>
            router.push(
              `${ROUTE_PATH.SWAP}?from_token=${WBTC_ADDRESS}&to_token=${data?.address}`,
            )
          }
        >
          Buy Now
        </FiledButton>
        {compareString(data.owner, account) && (
          <FiledButton
            btnSize="h"
            variant={'outline'}
            style={{
              color: colors.white,
              fontSize: '16px',
              backgroundColor: 'transparent',
              borderColor: 'white',
            }}
            onClick={() =>
              router.push(`${ROUTE_PATH.UPDATE_TOKEN_INFO}?address=${data?.address}`)
            }
          >
            Update token info
          </FiledButton>
        )}
      </Flex>
    </StyledTokenTopInfo>
  );
};

export default TokenTopInfo;
