/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  L2_CHAIN_INFO,
  SupportedChainId,
  TRUSTLESS_COMPUTER_CHAIN_INFO,
} from '@/constants/chains';
import { ROUTE_PATH } from '@/constants/route-path';
import { IResourceChain } from '@/interfaces/chain';
import { useAppDispatch } from '@/state/hooks';
import {selectPnftExchange, updateConfigs, updateCurrentChain} from '@/state/pnftExchange';
import { compareString } from '@/utils';
import { Flex, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { BiCheck, BiChevronDown } from 'react-icons/bi';
import { useSelector } from 'react-redux';
import s from './styles.module.scss';
import { CHAIN_INFO } from '@/constants/storage-key';
import store from "@/state";

export const ItemChain = ({
  _chain,
  showName,
  active,
}: {
  _chain: IResourceChain;
  showName?: boolean;
  active?: boolean;
}) => {
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
  const currentChain: IResourceChain = useSelector(selectPnftExchange).currentChain;
  const router = useRouter();
  const allConfigs: IResourceChain = store.getState().pnftExchange.allConfigs;

  useEffect(() => {
    if(allConfigs && currentChain?.chain) {
      const key = currentChain?.chain?.toLowerCase() || '';
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      store.dispatch(updateConfigs(allConfigs[key]));
    }
  }, [JSON.stringify(allConfigs), currentChain?.chain])

  const onChangeRouter = (_chainA?: any) => {
    dispatch(updateCurrentChain(_chainA));
    localStorage.setItem(CHAIN_INFO, JSON.stringify(_chainA));
  };

  useEffect(() => {
    const routerPath = router.pathname;

    if (compareString(currentChain?.chainId, SupportedChainId.L2)) {
      if (SUPPORT_PATH_V1.findIndex((v) => routerPath.includes(v)) > -1) {
        if (routerPath.includes(ROUTE_PATH.SWAP)) {
          router.push(`${ROUTE_PATH.ORIGINAL_SWAP}/nos`);
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
          router.push(`${ROUTE_PATH.ORIGINAL_SWAP}/tc`);
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
    <Menu placement="bottom-end">
      <MenuButton className={s.btnChainSelected}>
        <Flex alignContent={'center'}>
          <ItemChain _chain={currentChain} />
          <BiChevronDown color="#FFFFFF" style={{ fontSize: 20 }} />
        </Flex>
      </MenuButton>
      <MenuList className={s.chainList}>
        {[TRUSTLESS_COMPUTER_CHAIN_INFO, L2_CHAIN_INFO].map((c) => (
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
