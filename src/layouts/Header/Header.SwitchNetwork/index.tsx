/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  convertNetworkToResourceChain,
  SupportedChainId,
} from '@/constants/chains';
import { ROUTE_PATH } from '@/constants/route-path';
import { IResourceChain } from '@/interfaces/chain';
import { useAppDispatch } from '@/state/hooks';
import {
  configsSelector, currentChainSelector,
  selectPnftExchange,
  updateConfigs,
  updateCurrentChain,
} from '@/state/pnftExchange';
import { CHAIN_ID, compareString } from '@/utils';
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

export const ItemChain = ({
  _chain,
  showName,
  active,
}: IProps) => {

  return (
    <Flex className={s.itemChain}>
      <Flex alignItems={'center'} gap={2}>
        <img src={_chain?.icon} />
        <Text>{showName ? _chain?.name : _chain?.chain}</Text>
      </Flex>
      {active && <BiCheck color="#fff" style={{ fontSize: 20 }} />}
    </Flex>
  );
};

const SUPPORT_PATH_V2 = [
  ROUTE_PATH.SWAP_V2,
  ROUTE_PATH.POOLS_V2,
  ROUTE_PATH.POOLS_V2_ADD,
  ROUTE_PATH.POOLS_V2_INCREASE,
  ROUTE_PATH.POOLS_V2_REMOVE,
];

const SUPPORT_PATH_V1 = [
  ROUTE_PATH.SWAP,
  ROUTE_PATH.POOLS,
];

const HeaderSwitchNetwork = () => {
  const dispatch = useAppDispatch();
  const currentChain: IResourceChain = useSelector(currentChainSelector);
  const router = useRouter();
  const isL2 = useCheckIsLayer2();
  const allConfigs: any = useSelector(selectPnftExchange).allConfigs;
  const configs = useSelector(configsSelector);

  const networks = React.useMemo(() => {
    return isL2 ? configs.map(v => convertNetworkToResourceChain(v)).filter((v) => v?.chainId !== CHAIN_ID.TRUSTLESS_COMPUTER) : configs;
  }, [isL2, configs])

  const onChangeRouter = (_chainA?: IResourceChain) => {
    dispatch(updateCurrentChain(_chainA));
    const key = _chainA?.chain?.toLowerCase() || '';
    dispatch(updateConfigs(allConfigs[key]));
    localStorage.setItem(CHAIN_INFO, JSON.stringify(_chainA));
  };

  useEffect(() => {
    const routerPath = router.pathname;

    if (compareString(currentChain?.chainId, SupportedChainId.L2)) {
      if (SUPPORT_PATH_V1.findIndex((v) => routerPath.includes(v)) > -1) {
        if (routerPath.includes(ROUTE_PATH.SWAP)) {
          router.push(`${ROUTE_PATH.ORIGINAL_SWAP}/nos?from_token=${L2_USDT_ADDRESS}&to_token=${L2_WBTC_ADDRESS}`);
        } else if (routerPath.includes(ROUTE_PATH.POOLS)) {
          router.push(`${ROUTE_PATH.ORIGINAL_POOL}/nos`);
        }
      }
    } else if (
      compareString(
        currentChain?.chainId,
        SupportedChainId.TRUSTLESS_COMPUTER,
      )
    ) {
      if (SUPPORT_PATH_V2.findIndex((v) => routerPath.includes(v)) > -1) {
        if (routerPath.includes(ROUTE_PATH.SWAP_V2)) {
          router.push(`${ROUTE_PATH.ORIGINAL_SWAP}/tc?from_token=${WETH_ADDRESS}&to_token=${GM_ADDRESS}`);
        } else if (routerPath.includes(ROUTE_PATH.POOLS_V2)) {
          router.push(`${ROUTE_PATH.ORIGINAL_POOL}/tc`);
        } else if (routerPath.includes(ROUTE_PATH.POOLS_V2_ADD)) {
          router.push(`${ROUTE_PATH.ORIGINAL_POOL}/tc`);
        } else if (routerPath.includes(ROUTE_PATH.POOLS_V2_INCREASE)) {
          router.push(`${ROUTE_PATH.ORIGINAL_POOL}/tc`);
        } else if (routerPath.includes(ROUTE_PATH.POOLS_V2_REMOVE)) {
          router.push(`${ROUTE_PATH.ORIGINAL_POOL}/tc`);
        }
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
