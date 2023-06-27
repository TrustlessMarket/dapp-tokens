import store, { RootState } from '@/state';
import { UserState } from '@/state/user/reducer';
import { isSupportedChain } from '@/utils';

export const getUserSelector = (state: RootState): UserState | null => state.user;

export const getIsAuthenticatedSelector = (state: RootState): boolean => {
  const currentChainId = store.getState().pnftExchange.currentChainId;

  if (
    Boolean(state.user.walletAddress) &&
    Boolean(state.user.walletAddressBtcTaproot)
  ) {
    return true;
  }

  if (Boolean(state.user.walletAddress) && isSupportedChain(currentChainId)) {
    return true;
  }

  return false;
};
