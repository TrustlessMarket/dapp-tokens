/* eslint-disable @typescript-eslint/no-explicit-any */
import {compareString} from '@/utils';
import {Box, Flex, Text} from '@chakra-ui/react';
import s from './styles.module.scss';
import {L2_CHAIN_INFO, TRUSTLESS_COMPUTER_CHAIN_INFO} from "@/constants/chains";
import {useSelector} from "react-redux";
import {selectPnftExchange, updateCurrentChain} from "@/state/pnftExchange";
import {useAppDispatch} from "@/state/hooks";
import {useRouter} from "next/router";
import {ROUTE_PATH} from "@/constants/route-path";
import queryString from "query-string";

const SUPPORT_PATH_V2 = [
  ROUTE_PATH.SWAP_V2,
  ROUTE_PATH.MARKETS_V2,
  ROUTE_PATH.POOLS_V2,
];

const SUPPORT_PATH_V1 = [
  ROUTE_PATH.SWAP,
  ROUTE_PATH.MARKETS,
  ROUTE_PATH.POOLS,
];

const HeaderSwitchNetwork = () => {
  const dispatch = useAppDispatch();
  const currentSelectedChain = useSelector(selectPnftExchange).currentChain;
  const router = useRouter();

  const onChangeRouter = (_chainA?: any, _chainB?: any) => {
    if(!compareString(currentSelectedChain.chain, _chainA.chain)) {
      if(compareString(TRUSTLESS_COMPUTER_CHAIN_INFO.chain, _chainA.chain) && SUPPORT_PATH_V2.includes(router.pathname)) {
        const qs = '?' + queryString.stringify(router.query);
        const pathName = router.pathname.replace('/v2', '');
        router.replace(
          `${pathName}${qs}`,
        );
      } else if(compareString(L2_CHAIN_INFO.chain, _chainA.chain) && SUPPORT_PATH_V1.includes(router.pathname)) {
        const qs = '?' + queryString.stringify(router.query);
        const pathName = router.pathname + '/v2';
        router.replace(
          `${pathName}${qs}`,
        );
      }
    }

    dispatch(updateCurrentChain(_chainA));
  };

  return (
    <SwitchSymbol
      chainA={L2_CHAIN_INFO}
      chainB={TRUSTLESS_COMPUTER_CHAIN_INFO}
      currentSelectedChain={currentSelectedChain}
      onSelectChain={onChangeRouter}
    />
  );
};

export const SwitchSymbol = ({
  chainA,
  chainB,
  currentSelectedChain,
  onSelectChain,
}: {
  chainA: any;
  chainB: any;
  currentSelectedChain: any;
  onSelectChain: (_1?: any, _2?: any) => void;
}) => {
  const selectPair = (_chainA?: any, _chainB?: any) => {
    onSelectChain?.(_chainA, _chainB);
  };

  return (
    <Flex className={s.switchContainer}>
      <Box
        className={
          compareString(currentSelectedChain.chain, chainA?.chain)
            ? s.switchContainer__active
            : ''
        }
        onClick={() => selectPair(chainA, chainB)}
      >
        <Text>{chainA?.chain}</Text>
      </Box>
      <Box
        className={
          compareString(currentSelectedChain.chain, chainB?.chain)
            ? s.switchContainer__active
            : ''
        }
        onClick={() => selectPair(chainB, chainA)}
      >
        <Text>{chainB?.chain}</Text>
      </Box>
    </Flex>
  )
};

export default HeaderSwitchNetwork;
