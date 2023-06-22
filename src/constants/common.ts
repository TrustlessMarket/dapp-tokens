import { isDevelop } from '@/utils/commons';
import { TM_ADDRESS } from '@/configs';

export const PAGE_LOADED = 'PAGE_LOADED';
export const PAGE_LOADING = 'PAGE_LOADING';
export const PAGE_ENTER = 'PAGE_ENTER';

export const BRIDGE_SUPPORT_TOKEN = ['WBTC', 'WETH'];

export const WBTC_ADDRESS = isDevelop()
  ? '0x35Ee6CD47Ae96Ad50E3d85104196303394b350B4'
  : '0xfB83c18569fB43f1ABCbae09Baf7090bFFc8CBBD';
export const WETH_ADDRESS = isDevelop()
  ? '0x512C3651c9fC966ed657aCdc79b0eC538a016C7A'
  : '0x74B033e56434845E02c9bc4F0caC75438033b00D';
export const USDC_ADDRESS = '0x3ED8040D47133AB8A73Dc41d365578D6e7643E54';
export const USDT_ADDRESS = '0x3504e7aE408e89f30497DFB6a0B2F5b2e650764E';
export const GM_ADDRESS = isDevelop()
  ? '0x9Aaf0539d2261bB0788Ed22CEE50C8a0219E99e4'
  : '0x2fe8d5A64afFc1d703aECa8a566f5e9FaeE0C003';
export const OXBT_ADDRESS = '0x4A50C02CA92B363E337e79F1977865BBCF0b4630';
export const MXRC_ADDRESS = '0x0deD162F7ad87A29c43923103141f4Dc86a01AA1';

export const DEV_ADDRESS = '0xdd2863416081D0C10E57AaB4B3C5197183be4B34';

export const COMMON_TOKEN_CONTRACT = [
  WBTC_ADDRESS,
  GM_ADDRESS,
  USDT_ADDRESS,
  USDC_ADDRESS,
  WETH_ADDRESS,
  TM_ADDRESS,
];

export const COMMON_TOKEN_CONTRACT_INFO = {
  [WBTC_ADDRESS]: {
    symbol: 'WBTC',
  },
  [WETH_ADDRESS]: {
    symbol: 'WETH',
  },
};

export const TRUSTLESS_FAUCET = 'https://trustlessfaucet.io/';
export const TRUSTLESS_GASSTATION = 'https://tcgasstation.com/';
export const TRUSTLESS_BRIDGE = 'https://trustlessbridge.io/';
export const TRUSTLESS_COMPUTER = 'https://trustless.computer/';
export const GENERATIVE_DISCORD = 'https://generative.xyz/discord';
export const NEW_BITCOIN_CITY = 'https://newbitcoincity.com/';

export const TOKEN_ICON_DEFAULT =
  'https://cdn.trustless.computer/upload/1683530065704444020-1683530065-default-coin.svg';

export const DEFAULT_GAS_PRICE = 1e9;
