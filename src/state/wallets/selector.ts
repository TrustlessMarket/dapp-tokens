import { RootState } from '@/state';
import { WalletState } from './reducer';

export const getWalletSelector = (state: RootState): WalletState | null =>
  state.wallets;
