/* eslint-disable @typescript-eslint/no-explicit-any */
import { WalletTransactionData } from '@/components/Swap/alertInfoProcessing/interface';
import { NOS_SLIPPAGE_VALUE, SLIPPAGE_VALUE } from '@/constants/storage-key';
import localStorage from '@/utils/localstorage';
import { createSelector, createSlice } from '@reduxjs/toolkit';
import { RootState } from '.';
import { INetworkConfig } from '@/interfaces/state/pnftExchange';

interface NftyLendState {
  needReload: number;
  reloadRealtime: number;
  slippage: number;
  slippageNOS: number;
  loadingRealtime: boolean;
  currentTransaction: WalletTransactionData | undefined | null;
  showBanner: boolean;
  configs: any;
  currentChainId: any;
  currentChain: any;
  allConfigs: any;
}

const initialState: NftyLendState = {
  needReload: 0,
  reloadRealtime: 0,
  slippage: 100,
  slippageNOS: 0.5,
  loadingRealtime: false,
  currentTransaction: undefined,
  showBanner: true,
  configs: {},
  currentChainId: undefined,
  currentChain: undefined,
  allConfigs: {},
};

const slice = createSlice({
  name: 'pnftExchange',
  initialState,
  reducers: {
    requestReload: (state) => {
      state.needReload += 1;
    },
    requestReloadRealtime: (state) => {
      state.reloadRealtime += 1;
    },
    updateSlippage: (state, action) => {
      state.slippage = action.payload;
      localStorage.set(SLIPPAGE_VALUE, action.payload);
    },
    updateSlippageNOS: (state, action) => {
      state.slippageNOS = action.payload;
      localStorage.set(NOS_SLIPPAGE_VALUE, action.payload);
    },
    updateLoadingRealtime: (state, action) => {
      state.loadingRealtime = action.payload;
    },
    updateCurrentTransaction: (
      state,
      action: {
        payload: WalletTransactionData | null | undefined;
      },
    ) => {
      state.currentTransaction = action.payload;
    },
    updateShowBanner: (state, action) => {
      state.showBanner = action.payload;
    },
    updateConfigs: (state, action) => {
      state.configs = action.payload;
    },
    updateAllConfigs: (state, action) => {
      state.allConfigs = action.payload;
    },
    updateCurrentChainId: (state, action) => {
      state.currentChainId = action.payload;
    },
    updateCurrentChain: (state, action) => {
      state.currentChain = action.payload;
    },
  },
});

export const {
  requestReload,
  requestReloadRealtime,
  updateSlippage,
  updateSlippageNOS,
  updateLoadingRealtime,
  updateCurrentTransaction,
  updateShowBanner,
  updateConfigs,
  updateAllConfigs,
  updateCurrentChainId,
  updateCurrentChain,
} = slice.actions;

export const selectPnftExchange = (state: RootState) => state.pnftExchange;
export const selectCurrentTransaction = (state: RootState) =>
  state.pnftExchange.currentTransaction;

export const configsSelector = createSelector(selectPnftExchange, (allConfigs) => {
  return Object.values(allConfigs.allConfigs || {}) as INetworkConfig[];
});

export default slice.reducer;
