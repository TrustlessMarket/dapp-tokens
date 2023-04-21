import { ROUTE_PATH } from '@/constants/route-path';

export const MENU_HEADER = [
  {
    id: 'menu-1',
    name: 'Build',
    route: ROUTE_PATH.HOME,
    activePath: '',
  },
  {
    id: 'menu-2',
    name: 'Use',
    route: ROUTE_PATH.USE_TRUSTLESS,
    activePath: 'use-trustless-computer',
  },
  {
    id: 'menu-3',
    name: 'Dapp Store',
    route: ROUTE_PATH.DAPPS,
    activePath: 'dapps',
  },
];

export const MENU_MOBILE = [...MENU_HEADER];
