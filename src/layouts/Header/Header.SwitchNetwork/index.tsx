/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  L2_CHAIN_INFO,
  SupportedChainId,
  TRUSTLESS_COMPUTER_CHAIN_INFO,
} from '@/constants/chains';
import { ROUTE_PATH } from '@/constants/route-path';
import { IResourceChain } from '@/interfaces/chain';
import { useAppDispatch } from '@/state/hooks';
import { selectPnftExchange, updateCurrentChain } from '@/state/pnftExchange';
import { compareString } from '@/utils';
import { Flex, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { BiCheck, BiChevronDown } from 'react-icons/bi';
import { useSelector } from 'react-redux';
import s from './styles.module.scss';

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
  ROUTE_PATH.MARKETS_V2,
  ROUTE_PATH.POOLS_V2,
  ROUTE_PATH.POOLS_V2_ADD,
  ROUTE_PATH.POOLS_V2_INCREASE,
  ROUTE_PATH.POOLS_V2_REMOVE,
  ROUTE_PATH.TOKEN_V2,
  ROUTE_PATH.HOME_V2,
  ROUTE_PATH.LAUNCHPAD_V2
];

const SUPPORT_PATH_V1 = [
  ROUTE_PATH.SWAP,
  ROUTE_PATH.MARKETS,
  ROUTE_PATH.POOLS,
  ROUTE_PATH.TOKEN,
  ROUTE_PATH.HOME,
  ROUTE_PATH.LAUNCHPAD,
];

const HeaderSwitchNetwork = () => {
  const dispatch = useAppDispatch();
  const currentSelectedChain: IResourceChain =
    useSelector(selectPnftExchange).currentChain;
  const router = useRouter();

  const onChangeRouter = (_chainA?: any) => {
    dispatch(updateCurrentChain(_chainA));
  };

  useEffect(() => {
    const routerPath = router.pathname;

    if (compareString(currentSelectedChain?.chainId, SupportedChainId.L2)) {
      if (SUPPORT_PATH_V1.findIndex((v) => routerPath.includes(v)) > -1) {
        if (routerPath.includes(ROUTE_PATH.SWAP)) {
          router.push(`${ROUTE_PATH.ORIGINAL_SWAP}/nos`);
        } else if (routerPath.includes(ROUTE_PATH.POOLS)) {
          router.push(`${ROUTE_PATH.ORIGINAL_POOL}/nos`);
        } else if (routerPath.includes(ROUTE_PATH.MARKETS)) {
          router.push(`${ROUTE_PATH.ORIGINAL_MARKETS}/nos`);
        } else if (routerPath.includes(ROUTE_PATH.TOKEN)) {
          router.push(`${ROUTE_PATH.ORIGINAL_TOKEN}/nos`);
        } else if (routerPath.includes(ROUTE_PATH.LAUNCHPAD)) {
          router.push(`${ROUTE_PATH.ORIGINAL_LAUNCHPAD}/nos`);
        } else if (routerPath.includes(ROUTE_PATH.HOME)) {
          router.push(`${ROUTE_PATH.ORIGINAL_HOME}/nos`);
        }
      }
    } else if (
      compareString(
        currentSelectedChain?.chainId,
        SupportedChainId.TRUSTLESS_COMPUTER,
      )
    ) {
      if (SUPPORT_PATH_V2.findIndex((v) => routerPath.includes(v)) > -1) {
        if (routerPath.includes(ROUTE_PATH.SWAP_V2)) {
          router.push(`${ROUTE_PATH.ORIGINAL_SWAP}/tc`);
        } else if (routerPath.includes(ROUTE_PATH.POOLS_V2)) {
          router.push(`${ROUTE_PATH.ORIGINAL_POOL}/tc`);
        } else if (routerPath.includes(ROUTE_PATH.MARKETS_V2)) {
          router.push(`${ROUTE_PATH.ORIGINAL_MARKETS}/tc`);
        } else if (routerPath.includes(ROUTE_PATH.POOLS_V2_ADD)) {
          router.push(`${ROUTE_PATH.ORIGINAL_POOL}/tc`);
        } else if (routerPath.includes(ROUTE_PATH.POOLS_V2_INCREASE)) {
          router.push(`${ROUTE_PATH.ORIGINAL_POOL}/tc`);
        } else if (routerPath.includes(ROUTE_PATH.POOLS_V2_REMOVE)) {
          router.push(`${ROUTE_PATH.ORIGINAL_POOL}/tc`);
        } else if (routerPath.includes(ROUTE_PATH.TOKEN_V2)) {
          router.push(`${ROUTE_PATH.ORIGINAL_TOKEN}/tc`);
        } else if (routerPath.includes(ROUTE_PATH.LAUNCHPAD_V2)) {
          router.push(`${ROUTE_PATH.ORIGINAL_LAUNCHPAD}/tc`);
        } else if (routerPath.includes(ROUTE_PATH.HOME_V2)) {
          router.push(`${ROUTE_PATH.ORIGINAL_HOME}/tc`);
        }
      }
    }
  }, [currentSelectedChain]);

  return (
    <Menu placement="bottom-end">
      <MenuButton className={s.btnChainSelected}>
        <Flex alignContent={'center'}>
          <ItemChain _chain={currentSelectedChain} />
          <BiChevronDown color="#FFFFFF" style={{ fontSize: 20 }} />
        </Flex>
      </MenuButton>
      <MenuList className={s.chainList}>
        {[TRUSTLESS_COMPUTER_CHAIN_INFO, L2_CHAIN_INFO].map((c) => (
          <MenuItem onClick={() => onChangeRouter(c)} key={c.chainId}>
            <ItemChain
              _chain={c}
              showName={true}
              active={compareString(c.chainId, currentSelectedChain?.chainId)}
            />
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default HeaderSwitchNetwork;
