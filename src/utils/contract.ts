/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import { L2_NETWORK_RPC, TC_NETWORK_RPC } from '@/configs';
import { SupportedChainId } from '@/constants/chains';
import { isAddress } from '@ethersproject/address';
import { AddressZero } from '@ethersproject/constants';
import { Contract } from '@ethersproject/contracts';
import type { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { isSupportedChain } from './chain';
import { compareString } from './string';
import store from '@/state';
import { IResourceChain } from '@/interfaces/chain';

function getProviderOrSigner(
  provider: JsonRpcProvider,
  account?: string,
): JsonRpcProvider | JsonRpcSigner {
  return account ? getSigner(provider, account) : provider;
}

function getSigner(provider: JsonRpcProvider, account: string): JsonRpcSigner {
  return provider.getSigner(account);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getContract(
  address: string,
  ABI: any,
  provider: JsonRpcProvider,
  account?: string,
): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new Contract(address, ABI, getProviderOrSigner(provider, account) as any);
}

export const getDefaultProvider = () => {
  const { provider: defaultProvider, chainId } = useWeb3React();
  const currentChain: IResourceChain = store.getState().pnftExchange.currentChain;

  let provider: any = defaultProvider;
  if ((!provider && window.ethereum) || !isSupportedChain(chainId)) {
    provider = new ethers.providers.JsonRpcProvider(
      compareString(currentChain.chainId, SupportedChainId.L2)
        ? L2_NETWORK_RPC
        : TC_NETWORK_RPC,
    );
  }

  return provider;
};

export const isConnectedTrustChain = () => {
  const { isActive, chainId } = useWeb3React();

  if (isActive && compareString(chainId, SupportedChainId.TRUSTLESS_COMPUTER)) {
    return true;
  }

  return false;
};
