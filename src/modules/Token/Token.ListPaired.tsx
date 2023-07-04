/* eslint-disable @typescript-eslint/no-explicit-any */
import Empty from '@/components/Empty';
import HorizontalItem from '@/components/HorizontalItem';
import FiledButton from '@/components/Swap/button/filedButton';
import { ROUTE_PATH } from '@/constants/route-path';
import useGetReserves from '@/hooks/contract-operations/swap/useReserves';
import useSupplyERC20Liquid from '@/hooks/contract-operations/token/useSupplyERC20Liquid';
import { IToken } from '@/interfaces/token';
import { getListPaired } from '@/services/pool';
import {abbreviateNumber, compareString, formatCurrency} from '@/utils';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Skeleton,
  Text,
} from '@chakra-ui/react';
import moment from 'moment';
import { useRouter } from 'next/router';
import {useContext, useEffect, useState} from 'react';
import web3 from 'web3';
import { DEFAULT_FROM_TOKEN_ADDRESS, ScreenType } from '../Pools';
import {WalletContext} from "@/contexts/wallet-context";
import {IResourceChain} from "@/interfaces/chain";
import {SupportedChainId} from "@/constants/chains";
import {useSelector} from "react-redux";
import {selectPnftExchange} from "@/state/pnftExchange";

const TokenPoolDetail = ({ paired }: { paired: any }) => {
  const router = useRouter();
  const token0: IToken = paired?.token0Obj;
  const token1: IToken = paired?.token1Obj;
  const currentSelectedChain: IResourceChain =
    useSelector(selectPnftExchange).currentChain;

  const [supply, setSupply] = useState<any>({
    ownerSupply: '0',
    totalSupply: '0',
  });
  const [perPrice, setPerPrice] = useState<any>({
    _reserve0: '0',
    _reserve1: '0',
  });

  const { call: getReserves } = useGetReserves();
  const { call: getSupply } = useSupplyERC20Liquid();

  useEffect(() => {
    getData();
  }, [paired?.pair]);

  const getData = async () => {
    if (!paired?.pair) {
      return;
    }

    try {
      const pairAddress = paired?.pair;
      const [resReserves, resSupply] = await Promise.allSettled([
        getReserves({
          address: pairAddress,
        }),
        getSupply({
          liquidAddress: pairAddress,
        }),
      ]);
      if (resReserves.status === 'fulfilled') {
        setPerPrice(resReserves.value);
      }
      if (resSupply.status === 'fulfilled') {
        setSupply(resSupply.value);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <AccordionItem mb={4} className="accordion-container">
      <Text>
        <AccordionButton>
          <Box as="span" flex="1" textAlign="left">
            {token0.symbol} - {token1.symbol}
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </Text>
      <AccordionPanel pb={4}>
        <HorizontalItem
          label="Total liquidity:"
          value={`${abbreviateNumber(web3.utils.fromWei(supply.totalSupply))}`}
          valueTitle={`${formatCurrency(web3.utils.fromWei(supply.totalSupply))}`}
        />
        <HorizontalItem
          label={`Pooled ${token0.symbol}:`}
          value={`${abbreviateNumber(web3.utils.fromWei(perPrice._reserve0))}`}
          valueTitle={`${formatCurrency(web3.utils.fromWei(perPrice._reserve0))}`}
        />
        <HorizontalItem
          label={`Pooled ${token1.symbol}:`}
          value={`${abbreviateNumber(web3.utils.fromWei(perPrice._reserve1))}`}
          valueTitle={`${formatCurrency(
            web3.utils.fromWei(perPrice._reserve1),
            10,
          )}`}
        />
        <HorizontalItem
          label={`APR:`}
          value={`${formatCurrency(paired?.apr, 2)}%`}
        />
        <HorizontalItem
          label="Pool created:"
          value={moment(paired.created_at).format('YYYY-MM-DD HH:mm')}
        />
        <Flex mt={4} gap={4} justifyContent={'center'} alignItems={'center'}>
          <FiledButton
            btnSize="l"
            style={{ color: 'white' }}
            onClick={() => {
              const isL2 = compareString(currentSelectedChain?.chainId, SupportedChainId.L2);
              const routePath = isL2 ? ROUTE_PATH.SWAP_V2 : ROUTE_PATH.SWAP;
              router.push(
                `${routePath}?from_token=${token0?.address}&to_token=${token1.address}`,
              )
            }}
          >
            Swap now
          </FiledButton>
          <FiledButton
            btnSize="l"
            variant={'outline'}
            className="btn-add-liquid"
            onClick={() => {
              const isL2 = compareString(currentSelectedChain?.chainId, SupportedChainId.L2);
              const routePath = isL2
                ? `${ROUTE_PATH.POOLS_V2_ADD}/${token0?.address}/${token1?.address}`
                : `${ROUTE_PATH.POOLS}?type=${ScreenType.add_liquid}&f=${token0.address}&t=${token1.address}`;
              router.push(
                `${routePath}`,
              )
            }}
          >
            Add liquidity
          </FiledButton>
        </Flex>
      </AccordionPanel>
    </AccordionItem>
  );
};

const TokenListPaired = ({ data }: { data: IToken }) => {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const currentSelectedChain: IResourceChain =
    useSelector(selectPnftExchange).currentChain;

  const router = useRouter();

  const { getConnectedChainInfo } = useContext(WalletContext);
  const chainInfo: IResourceChain = getConnectedChainInfo();

  useEffect(() => {
    getData();
  }, [data?.address]);

  const getData = async () => {
    if (!data?.address) {
      return;
    }

    try {
      const response: any = await getListPaired({
        from_token: data.address,
        network: chainInfo?.chain?.toLowerCase()
      });

      setList(response || []);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Box>
          <Skeleton height="10px" width={'50%'} />
          <Skeleton height="20px" mt={1} />
        </Box>
      );
    }
    if (list?.length === 0) {
      return (
        <Box>
          <Empty isTable={false} />
          <Text className="empty-pool">Empty pool</Text>
          <Box mt={6} />
          <FiledButton
            onClick={() => {
              const isL2 = compareString(currentSelectedChain?.chainId, SupportedChainId.L2);
              const routePath = isL2
                ? `${ROUTE_PATH.POOLS_V2_ADD}/${data.address}/${DEFAULT_FROM_TOKEN_ADDRESS}`
                : `${ROUTE_PATH.POOLS}?type=${ScreenType.add_liquid}&f=${data.address}&t=${DEFAULT_FROM_TOKEN_ADDRESS}`;
              router.push(
                `${routePath}`,
              )
            }}
            btnSize="l"
            className="btn-add-liquid"
          >
            Add Liquidity
          </FiledButton>
        </Box>
      );
    }
    return (
      <Accordion defaultIndex={[0]} allowMultiple>
        {list?.map((l: any) => (
          <TokenPoolDetail paired={l} key={l.id} />
        ))}
      </Accordion>
    );
  };

  return (
    <Box className="token-info list-paired-container">
      <Text className="title">Pools</Text>
      <Box className="list-paired-content" mt={4}>
        {renderContent()}
      </Box>
    </Box>
  );
};

export default TokenListPaired;
