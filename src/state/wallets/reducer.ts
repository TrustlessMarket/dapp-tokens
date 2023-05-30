import { createSlice } from '@reduxjs/toolkit';
import { shallowEqual } from 'react-redux';

import { IAccount, Wallet } from './types';

/* Used to track wallets that have been connected by the user in current session, and remove them when deliberately disconnected. 
  Used to compute is_reconnect event property for analytics */
export interface WalletState {
  connectedWallets: Wallet[];
  accounts: IAccount[];
}

const initialState: WalletState = {
  connectedWallets: [],
  accounts: [],
};

const walletsSlice = createSlice({
  name: 'wallets',
  initialState,
  reducers: {
    addConnectedWallet(state, { payload }) {
      const existsAlready = state.connectedWallets.find((wallet) =>
        shallowEqual(payload, wallet),
      );
      if (!existsAlready) {
        state.connectedWallets = state.connectedWallets.concat(payload);
      }
    },
    removeConnectedWallet(state, { payload }) {
      state.connectedWallets = state.connectedWallets.filter(
        (wallet) => !shallowEqual(wallet, payload),
      );
    },
    addAccounts(state, { payload }) {
      state.accounts = payload;
    },
  },
});

export const { addConnectedWallet, addAccounts } = walletsSlice.actions;
export default walletsSlice.reducer;
