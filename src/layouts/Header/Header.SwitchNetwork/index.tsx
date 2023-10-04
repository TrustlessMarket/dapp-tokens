/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  convertNetworkToResourceChain,
} from '@/constants/chains';
import { ROUTE_PATH } from '@/constants/route-path';
import { IResourceChain } from '@/interfaces/chain';
import { useAppDispatch } from '@/state/hooks';
import {
  configsSelector, currentChainSelector,
  selectPnftExchange,
  updateConfigs,
  updateCurrentChain,
  updateCurrentChainId,
} from '@/state/pnftExchange';
import { CHAIN_ID, compareString, getChainNameRequestAPI } from '@/utils';
import { Flex, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { BiCheck, BiChevronDown } from 'react-icons/bi';
import { useSelector } from 'react-redux';
import s from './styles.module.scss';
import { CHAIN_INFO } from '@/constants/storage-key';
import { L2_USDT_ADDRESS, L2_WBTC_ADDRESS } from '@/configs';
import { GM_ADDRESS, WETH_ADDRESS } from '@/constants/common';
import useCheckIsLayer2 from '@/hooks/useCheckIsLayer2';

interface IProps {
  _chain: IResourceChain;
  showName?: boolean;
  active?: boolean;
}

export const ItemChain = ({ _chain, showName, active }: IProps) => {
  return (
    <Flex className={s.itemChain}>
      <Flex alignItems={'center'} gap={2}>
        <img src={_chain?.icon} alt="image-chain" />
        <Text>{showName ? _chain?.name : _chain?.chain}</Text>
      </Flex>
      {active && <BiCheck color='#fff' style={{ fontSize: 20 }} />}
    </Flex>
  );
};

const HeaderSwitchNetwork = () => {
  const dispatch = useAppDispatch();
  const currentChain: IResourceChain = useSelector(currentChainSelector);
  const router = useRouter();
  const isL2 = useCheckIsLayer2();
  const allConfigs: any = useSelector(selectPnftExchange).allConfigs;
  const configs = useSelector(configsSelector);

  const networks = React.useMemo(() => {
    return isL2 ?
      configs.map(v => convertNetworkToResourceChain(v)).filter((v) => Number(v?.chainId) !== CHAIN_ID.TRUSTLESS_COMPUTER) :
      configs.map(v => convertNetworkToResourceChain(v));
  }, [isL2, configs]);

  const onChangeRouter = (_chainA?: IResourceChain) => {
    const key = _chainA?.chain?.toLowerCase() || '';
    if (key && allConfigs[key]) {
      const network = allConfigs[key];
      dispatch(updateCurrentChain(_chainA));
      dispatch(updateConfigs(network));
      dispatch(updateCurrentChain(convertNetworkToResourceChain(network)));
      dispatch(updateCurrentChainId(Number(network.chainId)));
      localStorage.setItem(CHAIN_INFO, JSON.stringify(_chainA));
    }
  };

  useEffect(() => {
    const slug = router.query.slug as string;
    if (!!currentChain && !compareString(slug, currentChain.chain)) {
      const chainName = getChainNameRequestAPI(currentChain);
      switch (currentChain.chainId) {
        case CHAIN_ID.TRUSTLESS_COMPUTER:
          router.push(`${ROUTE_PATH.ORIGINAL_SWAP}/tc?from_token=${WETH_ADDRESS}&to_token=${GM_ADDRESS}`);
          break;
        case CHAIN_ID.NOS:
          router.push(`${ROUTE_PATH.ORIGINAL_SWAP}/${chainName}?from_token=${L2_USDT_ADDRESS}&to_token=${L2_WBTC_ADDRESS}`);
          break;
        default:
          router.push(`${ROUTE_PATH.ORIGINAL_SWAP}/${chainName}`);
      }
    }
  }, [currentChain]);

  return (
    <Menu placement='bottom-end'>
      <MenuButton className={s.btnChainSelected}>
        <Flex alignContent={'center'}>
          <ItemChain _chain={currentChain} />
          <BiChevronDown color='#FFFFFF' style={{ fontSize: 20 }} />
        </Flex>
      </MenuButton>
      <MenuList className={s.chainList}>
        {networks.map((c) => (
          <MenuItem onClick={() => onChangeRouter(c)} key={c.chainId}>
            <ItemChain
              _chain={c}
              showName={true}
              active={compareString(c.chainId, currentChain?.chainId)}
            />
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default HeaderSwitchNetwork;
