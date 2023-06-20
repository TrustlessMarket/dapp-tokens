import { UserState } from '@/state/user/reducer';
import store, { RootState } from '@/state';
import { compareString } from '@/utils';
import { SupportedChainId } from '@/constants/chains';

export const getUserSelector = (state: RootState): UserState | null => state.user;

export const getIsAuthenticatedSelector = (state: RootState): boolean => {
  const currentChainId = store.getState().pnftExchange.currentChainId;

  console.log('currentChainId', currentChainId);

  if (
    Boolean(state.user.walletAddress) &&
    Boolean(state.user.walletAddressBtcTaproot)
  ) {
    return true;
  }

  if (
    Boolean(state.user.walletAddress) &&
    compareString(currentChainId, SupportedChainId.ETH)
  ) {
    return true;
  }

  return false;
};
