import { getContract, getDefaultProvider } from '@/utils';
import { Contract } from '@ethersproject/contracts';
import { useMemo } from 'react';
import useTCWallet from './useTCWallet';

export function useContract<T extends Contract = Contract>(
  contractAddress: string | undefined,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ABI: any,
  withSignerIfPossible = true,
): T | null {
  const { tcWalletAddress: account } = useTCWallet();
  const provider = getDefaultProvider();

  return useMemo(() => {
    if (!contractAddress || !ABI || !provider) return null;
    try {
      return getContract(
        contractAddress,
        ABI,
        provider,
        withSignerIfPossible && account ? account : undefined,
      );
    } catch (error) {
      console.error('Failed to get contract', error);
      return null;
    }
  }, [contractAddress, ABI, provider, withSignerIfPossible, account]) as T;
}
