import { createSlice } from "@reduxjs/toolkit";
import { RootState } from ".";
import localStorage from '@/utils/localstorage';
import {SLIPPAGE_VALUE} from "@/constants/storage-key";

interface NftyLendState {
  needReload: number;
  reloadRealtime: number;
  slippage: number;
  loadingRealtime: boolean;
}

const initialState: NftyLendState = {
  needReload: 0,
  reloadRealtime: 0,
  slippage: 1,
  loadingRealtime: false
};

const slice = createSlice({
  name: "pnftExchange",
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
  },
});

export const {
  requestReload,
  requestReloadRealtime,
  updateSlippage,
  updateLoadingRealtime,
} = slice.actions;

export const selectPnftExchange = (state: RootState) => state.pnftExchange;

export default slice.reducer;
