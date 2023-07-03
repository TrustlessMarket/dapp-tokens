/* eslint-disable @typescript-eslint/no-explicit-any */
import {compareString} from '@/utils';
import {Box, Flex, Text} from '@chakra-ui/react';
import s from './styles.module.scss';
import {L2_CHAIN_INFO, TRUSTLESS_COMPUTER_CHAIN_INFO} from "@/constants/chains";
import {useSelector} from "react-redux";
import {selectPnftExchange, updateCurrentChain} from "@/state/pnftExchange";
import {useAppDispatch} from "@/state/hooks";

const HeaderSwitchNetwork = () => {
  const dispatch = useAppDispatch();
  const currentSelectedChain = useSelector(selectPnftExchange).currentChain;

  const onChangeRouter = (_tkA?: any, _tkB?: any) => {
    dispatch(updateCurrentChain(_tkA));
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
