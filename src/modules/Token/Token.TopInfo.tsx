import SocialToken from '@/components/Social';
import FiledButton from '@/components/Swap/button/filedButton';
import { WBTC_ADDRESS, WETH_ADDRESS } from '@/constants/common';
import { ROUTE_PATH } from '@/constants/route-path';
import { IToken } from '@/interfaces/token';
import { colors } from '@/theme/colors';
import { compareString, formatCurrency } from '@/utils';
import { Box, Flex, Text } from '@chakra-ui/react';
import { useWeb3React } from '@web3-react/core';
import { useRouter } from 'next/router';
import { AiOutlineCaretDown, AiOutlineCaretUp } from 'react-icons/ai';

const TokenTopInfo = ({ data }: { data: IToken }) => {
  const router = useRouter();
  const { account } = useWeb3React();

  return (
    <>
      <Flex alignItems={'center'} className="topinfo-left">
        <Flex className="avatar-container">
          <img
            src={
              data?.thumbnail ||
              'https://cdn.trustless.computer/upload/1683530065704444020-1683530065-default-coin.svg'
            }
            alt={data?.thumbnail || 'default-icon'}
            className={'avatar'}
          />
          <Flex
            className="block-info mobile"
            ml={10}
            gap={4}
            flexDirection={'column'}
          >
            <FiledButton
              btnSize="m"
              style={{
                color: colors.white,
                fontSize: '16px',
              }}
              onClick={() => {
                const from_token = compareString(data?.symbol, 'GM')
                  ? WETH_ADDRESS
                  : WBTC_ADDRESS;
                router.push(
                  `${ROUTE_PATH.SWAP}?from_token=${from_token}&to_token=${data?.address}`,
                );
              }}
            >
              Swap Now
            </FiledButton>
            {compareString(data.owner, account) && (
              <FiledButton
                btnSize="m"
                variant={'outline'}
                style={{
                  color: colors.white,
                  fontSize: '16px',
                  backgroundColor: 'transparent',
                  borderColor: 'white',
                }}
                onClick={() =>
                  router.push(
                    `${ROUTE_PATH.UPDATE_TOKEN_INFO}?address=${data?.address}`,
                  )
                }
              >
                Update token info
              </FiledButton>
            )}
          </Flex>
        </Flex>

        <Box className="block-info">
          <Text className="title">
            {data.name} ({data.symbol})
          </Text>
          <Text className="desc">
            #{data.index} | {data?.network}
          </Text>
          {/* <Text className="desc desktop">#{data.index}</Text> */}
        </Box>
        <Flex className="block-info diver-right price">
          <Text className="title">
            {formatCurrency(Number(data.btcPrice || 0).toFixed(18), 18)}{' '}
            {data?.baseTokenSymbol || 'WBTC'}
          </Text>
          <Text className="desc">
            ${formatCurrency(Number(data.usdPrice || 0).toFixed(18), 18)}
          </Text>
        </Flex>
        <Flex className="percent-up-down-container">
          <Flex className="block-info diver-right percent">
            <Text className="desc">24H %</Text>
            <Flex className="percent-up-down" alignItems={'center'} gap={1}>
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
          <Flex className="block-info diver-right percent">
            <Text className="desc">7D %</Text>
            <Flex className="percent-up-down" alignItems={'center'} gap={1}>
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
        </Flex>

        <Flex className="block-info">
          <Text className="desc">SOCIALS</Text>
          <SocialToken socials={data.social} />
        </Flex>
      </Flex>
      <Flex
        className="block-info desktop"
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
          onClick={() => {
            const from_token = compareString(data?.symbol, 'GM')
              ? WETH_ADDRESS
              : WBTC_ADDRESS;
            router.push(
              `${ROUTE_PATH.SWAP}?from_token=${from_token}&to_token=${data?.address}`,
            );
          }}
        >
          Swap Now
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
    </>
  );
};

export default TokenTopInfo;
