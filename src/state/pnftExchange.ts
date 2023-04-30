import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '.';
import localStorage from '@/utils/localstorage';
import { SLIPPAGE_VALUE } from '@/constants/storage-key';
import { WalletTransactionData } from '@/interfaces/walletTransaction';

interface NftyLendState {
  needReload: number;
  reloadRealtime: number;
  slippage: number;
  loadingRealtime: boolean;
  currentTransaction: WalletTransactionData | undefined;
}

const initialState: NftyLendState = {
  needReload: 0,
  reloadRealtime: 0,
  slippage: 1,
  loadingRealtime: false,
  currentTransaction: undefined,
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
    updateLoadingRealtime: (state, action) => {
      state.loadingRealtime = action.payload;
    },
    updateCurrentTransaction: (state, action) => {
      state.currentTransaction = action.payload;
    },
  },
});

export const {
  requestReload,
  requestReloadRealtime,
  updateSlippage,
  updateLoadingRealtime,
  updateCurrentTransaction,
} = slice.actions;

export const selectPnftExchange = (state: RootState) => state.pnftExchange;
export const selectCurrentTransaction = (state: RootState) =>
  state.pnftExchange.currentTransaction;

export default slice.reducer;
