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

export const getSwapTokens = async (params: IPagingParams): Promise<IToken[]> => {
  const qs = '?' + queryString.stringify(params);

  return swrFetcher(`${API_URL}/swap/token/list${qs}`, {
    method: 'GET',
    error: 'Fail to get tokens data',
  });
};
