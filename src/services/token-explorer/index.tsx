import { API_URL } from '@/configs';
import { IPagingParams } from '@/interfaces/api/query';
import { IToken } from '@/interfaces/token';
import { swrFetcher } from '@/utils/swr';
import queryString from 'query-string';

const API_PATH = '/token-explorer';
//TODO:  add type
export const getTokens = async (params: IPagingParams): Promise<IToken[]> => {
  const qs = '?' + queryString.stringify(params);

  return swrFetcher(`${API_URL}${API_PATH}/tokens${qs}`, {
    method: 'GET',
    error: 'Fail to get tokens data',
  });
};

export const getTokenRp = async (params: IPagingParams): Promise<IToken[]> => {
  const qs = '?is_test=1&' + queryString.stringify(params);

  return swrFetcher(`${API_URL}/swap/token/report${qs}`, {
    method: 'GET',
    error: 'Fail to get tokens data',
  });
};

export const getTokensByWallet = async (
  params: {
    key: string;
  } & IPagingParams,
): Promise<IToken[]> => {
  const qs = '?' + queryString.stringify(params);
  return swrFetcher(`${API_URL}${API_PATH}/tokens${qs}`, {
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

  return swrFetcher(`${API_URL}/swap/token/list${qs}`, {
    method: 'GET',
    error: 'Fail to get tokens data',
  });
};

export const scanTrx = async (params: { tx_hash: string }) => {
  const qs = '?' + queryString.stringify(params);
  return swrFetcher(`${API_URL}/swap/scan?tx_hash=${qs}`, {
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
  return swrFetcher(`${API_URL}/swap/fe-log`, {
    method: 'POST',
    data: payload,
    error: 'Fail to scan tx',
  });
};
