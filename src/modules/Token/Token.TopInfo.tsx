import SocialToken from '@/components/Social';
import FiledButton from '@/components/Swap/button/filedButton';
import {USDT_ADDRESS, WBTC_ADDRESS, WETH_ADDRESS} from '@/constants/common';
import { ROUTE_PATH } from '@/constants/route-path';
import { IToken } from '@/interfaces/token';
import { colors } from '@/theme/colors';
import { compareString, formatCurrency } from '@/utils';
import { Box, Flex, Text } from '@chakra-ui/react';
import { useWeb3React } from '@web3-react/core';
import { useRouter } from 'next/router';
import {SupportedChainId} from "@/constants/chains";
import {IResourceChain} from "@/interfaces/chain";
import {useSelector} from "react-redux";
import {selectPnftExchange} from "@/state/pnftExchange";
import {L2_ETH_ADDRESS, L2_WBTC_ADDRESS} from "@/configs";

const TokenTopInfo = ({ data }: { data: IToken }) => {
  const router = useRouter();
  const { account } = useWeb3React();
  const currentChain: IResourceChain = useSelector(selectPnftExchange).currentChain;

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
                mt={2}
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

        <Box className="block-info padding-32">
          <Text className="title">
            {data.name} ({data.symbol})
          </Text>
          <Text className="desc">{data?.network}</Text>
        </Box>

        <Flex className="block-info padding-40 diver-right price">
          <Text className="title">
            {formatCurrency(Number(data.btcPrice || 0).toFixed(18), 18)}{' '}
            {data?.baseTokenSymbol || 'WBTC'}
          </Text>
          <Text className="desc">
            ${formatCurrency(Number(data.usdPrice || 0).toFixed(18), 18)}
          </Text>
        </Flex>
        <Flex className="percent-up-down-container">
          <Flex className="block-info percent padding-40">
            <Text className="desc small">TOKEN</Text>
            <Flex className="percent-up-down" alignItems={'center'} gap={1}>
              <Text
                className="desc"
                style={{
                  color: colors.white,
                }}
              >
                #{data.index}
              </Text>
            </Flex>
          </Flex>
          <Flex className="block-info percent padding-40">
            <Text className="desc small">24H %</Text>
            <Flex className="percent-up-down" alignItems={'center'} gap={1}>
              <Text
                className="desc"
                style={{
                  color:
                    Number(data.percent) > 0
                      ? colors.greenPrimary
                      : Number(data.percent) < 0
                      ? colors.redPrimary
                      : colors.white500,
                }}
              >
                {Number(data.percent) > 0
                  ? '+ '
                  : Number(data.percent) < 0
                  ? '- '
                  : ''}
                {formatCurrency(Math.abs(parseFloat(data.percent)), 2)}%
              </Text>
            </Flex>
          </Flex>
          <Flex className="block-info percent padding-40">
            <Text className="desc small">7D %</Text>
            <Flex className="percent-up-down" alignItems={'center'} gap={1}>
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
                {Number(data.percent7Day) > 0
                  ? '+ '
                  : Number(data.percent7Day) < 0
                  ? '- '
                  : ''}
                {formatCurrency(Math.abs(parseFloat(data.percent7Day)), 2)}%
              </Text>
            </Flex>
          </Flex>
        </Flex>

        <Flex className="block-info">
          <Text className="desc small">SOCIALS</Text>
          <SocialToken socials={data.social} isShowEmpty />
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
            const isL2 = compareString(currentChain?.chainId, SupportedChainId.L2);
            const from_token = compareString(data?.symbol, 'GM')
              ? isL2 ? L2_ETH_ADDRESS : WETH_ADDRESS
              : isL2 ? L2_WBTC_ADDRESS : WBTC_ADDRESS;
            const to_token = compareString(from_token, data?.address) ? USDT_ADDRESS : data?.address;
            const routePath = isL2 ? ROUTE_PATH.SWAP_V2 : ROUTE_PATH.SWAP;
            router.push(
              `${routePath}?from_token=${from_token}&to_token=${to_token}`,
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
