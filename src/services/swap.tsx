import {API_URL} from '@/configs';
import {IPagingParams} from '@/interfaces/api/query';
import {IToken} from '@/interfaces/token';
import {swrFetcher} from '@/utils/swr';
import queryString from 'query-string';

const API_PATH = '/swap';

export const getTokenRp = async (params: IPagingParams): Promise<IToken[]> => {
  const qs = '?is_test=1&' + queryString.stringify(params);

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
  return swrFetcher(`${API_URL}${API_PATH}/scan?tx_hash=${qs}`, {
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
  return swrFetcher(`${API_URL}${API_PATH}/fe-log`, {
    method: 'POST',
    data: payload,
    error: 'Fail to scan tx',
  });
};
