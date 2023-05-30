/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import { TC_NETWORK_RPC } from '@/configs';
import { SupportedChainId } from '@/constants/chains';
import { isAddress } from '@ethersproject/address';
import { AddressZero } from '@ethersproject/constants';
import { Contract } from '@ethersproject/contracts';
import type { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { compareString } from './string';

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

export const getDefaultProvider = (): JsonRpcProvider => {
  const provider = new ethers.providers.JsonRpcProvider(TC_NETWORK_RPC);
  return provider;
};

export const isConnectedTrustChain = () => {
  const { isActive, chainId } = useWeb3React();

  if (isActive && compareString(chainId, SupportedChainId.TRUSTLESS_COMPUTER)) {
    return true;
  }

  return false;
};

export const remakeFunctionName: any = {
  swapExactTokensForTokens: 'Swap Tokens',
  addLiquidity: 'Add Liquidity',
  removeLiquidity: 'Remove Liquidity',
  approve: 'Approve Token',
  createLaunchpadPool: 'Created Launchpad Proposal',
  defeat: 'Defeated Launchpad Proposal',
  execute: 'Executed Launchpad Proposal',
};

export const getFunctionABI = (abi: any[] = [], name: string) => {
  const _abi = abi.find((v) => compareString(v.name, name));
  return {
    abi: [_abi],
    functionType: remakeFunctionName[name],
    functionName: `${name}(${_abi.inputs.map((v: any) => v.type)})`,
  };
};
