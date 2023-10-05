import React, { PropsWithChildren, useMemo } from 'react';
import {
  changeWallet,
  Environment,
  refreshProvider,
  setConfig,
  WalletType,
} from 'trustless-swap-sdk';
import { isProduction } from '@/utils/commons';
import { useWeb3React } from '@web3-react/core';
import { useAppSelector } from '@/state/hooks';
import { currentChainSelector, getConfigsChainSelector } from '@/state/pnftExchange';
import { INetworkConfig } from '@/interfaces/state/pnftExchange';
import { ROOT_API } from '@/configs';
import { IResourceChain } from '@/interfaces/chain';

export interface IConfigContext {
  onSetConfigSDK: () => void;
}

const initialValue: IConfigContext = {
  onSetConfigSDK: () => undefined,
};

export const ConfigContext = React.createContext<IConfigContext>(initialValue);

export const ConfigProvider: React.FC<PropsWithChildren> = ({
  children,
}: PropsWithChildren): React.ReactElement => {
  const { provider } = useWeb3React();
  const currentConfigChain: INetworkConfig | undefined = useAppSelector(
    getConfigsChainSelector,
  );
  const currentChain: IResourceChain = useAppSelector(currentChainSelector);

  const onSetConfigSDK = React.useCallback(() => {
    if (!currentConfigChain || !currentChain) return;
    changeWallet(WalletType.EXTENSION, '', '');
    refreshProvider(provider);
    setConfig({
      API_ROOT: ROOT_API,
      NONFUNGIBLE_POSITION_MANAGER_CONTRACT_ADDRESS:
        currentConfigChain.swapNonfungibleTokenPositionManager,
      POOL_FACTORY_CONTRACT_ADDRESS: currentConfigChain.swapFactoryContractAddr,
      QUOTER_CONTRACT_ADDRESS: currentConfigChain.swapQuoterV2ContractAddr,
      SWAP_ROUTER_ADDRESS: currentConfigChain.swapRouterContractAddr,
      TC_CONTRACT_ADDRESS: currentConfigChain.wtcContractAddress,
      WETH_CONTRACT_ADDRESS: currentConfigChain.wethContractAddress || '',
      chainName: currentConfigChain.chainName || currentConfigChain.name,
      env: isProduction() ? Environment.MAINNET : Environment.TESTNET,
      rpc: currentConfigChain.rpcUrl,
      tokens_list: [],
    });
  }, [currentChain, currentConfigChain, provider]);

  React.useEffect(onSetConfigSDK, [currentChain, currentConfigChain, provider]);

  const contextValues = useMemo((): IConfigContext => {
    return { onSetConfigSDK };
  }, [onSetConfigSDK]);

  return (
    <ConfigContext.Provider value={contextValues}>{children}</ConfigContext.Provider>
  );
};
