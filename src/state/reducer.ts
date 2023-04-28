import connection from './connection/reducer';
import user from './user/reducer';
import wallets from './wallets/reducer';
import modal from "@/state/modal";
import loadingOverlay from "@/state/loadingOverlay";
import pnftExchange from "@/state/pnftExchange";

export default {
  user,
  wallets,
  connection,
  modal,
  loadingOverlay,
  pnftExchange,
};
