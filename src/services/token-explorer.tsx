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

export const getTokenDetail = async (address: string): Promise<IToken> => {
  return swrFetcher(`${API_URL}${API_PATH}/token/${address}`, {
    method: 'GET',
    error: 'Fail to get token detail',
  });
}