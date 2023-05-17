import { API_URL } from '@/configs';
import { IPagingParams } from '@/interfaces/api/query';
import { IToken } from '@/interfaces/token';
import { swrFetcher } from '@/utils/swr';
import queryString from 'query-string';
import { isProduction } from '@/utils/commons';
import {ILiquidity} from "@/interfaces/liquidity";

const API_PATH = '/swap';

export const getTokenRp = async (
  params: IPagingParams & { address?: string, sort?: string, sort_type?: number },
): Promise<IToken[]> => {
  const qs = '?' + queryString.stringify(params);

  return swrFetcher(`${API_URL}${API_PATH}/token/report${qs}`, {
    method: 'GET',
    error: 'Fail to get tokens data',
  });
};

export interface IListTokenParams {
  is_test?: string;
  from_token?: string;
}

export const getSwapTokens = async (
  params: IPagingParams & IListTokenParams,
): Promise<IToken[]> => {
  const qs = '?' + queryString.stringify(params);

  return swrFetcher(`${API_URL}${API_PATH}/token/list${qs}`, {
    method: 'GET',
    error: 'Fail to get tokens data',
  });
};

export const scanTrx = async (params: { tx_hash: string }) => {
  const qs = '?' + queryString.stringify(params);
  return swrFetcher(`${API_URL}${API_PATH}/scan${qs}`, {
    method: 'GET',
    error: 'Fail to scan tx',
  });
};

interface LogErrorToServerPayload {
  type: 'error' | 'logs';
  address?: string;
  error: string;
  tx_hash?: string;
  message?: string;
}

export const logErrorToServer = async (payload: LogErrorToServerPayload) => {
  if (isProduction()) {
    return swrFetcher(`${API_URL}${API_PATH}/fe-log`, {
      method: 'POST',
      data: payload,
      error: 'Fail to log error',
    });
  }
};

export const getChartToken = async (
  params: {
    contract_address: string;
    chart_type: string;
  } & IPagingParams,
) => {
  const qs = '?' + queryString.stringify(params);
  return swrFetcher(`${API_URL}${API_PATH}/token/price${qs}`, {
    method: 'GET',
    error: 'Fail to scan tx',
  });
};

export const getTradeHistory = async (
  params: {
    contract_address: string;
  } & IPagingParams,
) => {
  const qs = '?' + queryString.stringify(params);
  return swrFetcher(`${API_URL}${API_PATH}/pair/trade-histories${qs}`, {
    method: 'GET',
    error: 'Fail to scan tx',
  });
};

export const getSwapRoutes = async (
  params: {
    from_token: string;
    to_token: string;
  }
) => {
  const qs = '?' + queryString.stringify(params);
  return swrFetcher(`${API_URL}${API_PATH}/token/route${qs}`, {
    method: 'GET',
    error: 'Fail to get route',
  });
};

export const getTMTransferHistory = async (
  params: {
    address: string;
  } & IPagingParams,
) => {
  const qs = '?' + queryString.stringify(params);
  // return swrFetcher(`${"https://dapp.dev.trustless.computer/dapp/api"}${API_PATH}/tm/histories${qs}`, {
  return swrFetcher(`${API_URL}${API_PATH}/tm/histories${qs}`, {
    method: 'GET',
    error: 'Fail to TM transfer history',
  });
};

export const getUserTradeHistory = async (
  params: {
    address: string;
  } & IPagingParams,
) => {
  const qs = '?' + queryString.stringify(params);
  return swrFetcher(`${API_URL}${API_PATH}/user/trade-histories${qs}`, {
    method: 'GET',
    error: 'Fail to get user trade history',
  });
};

export const getTCTxDetailByHash = async (
  params: {
    tx_hash: string
  },
) => {
  const qs = '?' + queryString.stringify(params);
  return swrFetcher(`${API_URL}${API_PATH}/transactions/pending${qs}`, {
    method: 'GET',
    error: 'Fail to TC Tx detail',
  });
};

export const getListLiquidity = async (
  params: IPagingParams,
): Promise<ILiquidity[]> => {
  const qs = '?' + queryString.stringify(params);
  return swrFetcher(`${API_URL}${API_PATH}/pair/apr/list${qs}`, {
    method: 'GET',
    error: 'Fail to get list liquidity',
  });
};