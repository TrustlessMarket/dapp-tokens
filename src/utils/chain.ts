import {
  L2_CHAIN_INFO,
  SupportedChainId,
  TRUSTLESS_COMPUTER_CHAIN_INFO,
} from '@/constants/chains';
import { IResourceChain } from '@/interfaces/chain';
import Web3 from 'web3';
import { setWalletChainId } from './auth-storage';
import { CHAIN_INFO } from '@/constants/storage-key';
import store from '@/state';
import { compareString } from './string';;
//import {AddEthereumChainParameter} from "@web3-react/types";
import { Connection } from '@/connection';
const API_PATH = 'https://chainid.network/chains.json';

export const getChainList = async (): Promise<Array<IResourceChain>> => {
  try {
    const res = await fetch(API_PATH);
    const data = await res.json();
    return [
      ...data,
      TRUSTLESS_COMPUTER_CHAIN_INFO,
      L2_CHAIN_INFO,
    ] as Array<IResourceChain>;
  } catch (err: unknown) {
    console.log('Failed to get chain list');
    console.log(err);
    return [TRUSTLESS_COMPUTER_CHAIN_INFO, L2_CHAIN_INFO];
  }
};

export function isSupportedChain(
  chainId: number | null | undefined,
): chainId is SupportedChainId {
  const currentChain: IResourceChain = store.getState().pnftExchange.currentChain;
  return (
    !!chainId &&
    !!SupportedChainId[chainId] &&
    compareString(currentChain?.chainId, chainId)
  );
}

export const switchChain = async (chainId: SupportedChainId,conn?: Connection) => {
  if(conn==undefined)
  {
    throw new Error(`Connect error`);
  }
  if (!isSupportedChain(chainId)) {
    throw new Error(`Chain ${chainId} not supported`);
  } else if (window.ethereum) {
    try {
      const chainList = await getChainList();
      const info = chainList.find((c: IResourceChain) => c.chainId === chainId);
      const addChainParameter  = {
        chainId: chainId,
        chainName:  info!=undefined?info.name:"",
        rpcUrls: [info!=undefined?info.rpc[0]:""],
        nativeCurrency: info!=undefined?info.nativeCurrency:[],
        blockExplorerUrls: [ info!=undefined?info.explorers[0].url:""],
      }
      console.log(addChainParameter)
      await conn.connector.activate(addChainParameter)
      setWalletChainId(chainId);
    } catch (err: unknown) {
      if (Object(err).code !== 4902) throw err;

      const chainList = await getChainList();
      const info = chainList.find((c: IResourceChain) => c.chainId === chainId);
      if (!info) {
        throw new Error(`Chain ${chainId} not supported`);
      }

      localStorage.setItem(CHAIN_INFO, JSON.stringify(info));

      const params = {
        chainId: Web3.utils.toHex(info.chainId),
        chainName: info.name,
        nativeCurrency: {
          name: info.nativeCurrency.name,
          symbol: info.nativeCurrency.symbol,
          decimals: info.nativeCurrency.decimals,
        },
        rpcUrls: info.rpc,
        blockExplorerUrls: [
          info.explorers && info.explorers.length > 0 && info.explorers[0].url
            ? info.explorers[0].url
            : info.infoURL,
        ],
      };

      await Object(window.ethereum).request({
        method: 'wallet_addEthereumChain',
        params: [params],
      });
    }
  }
};
