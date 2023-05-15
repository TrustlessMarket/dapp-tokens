import {API_URL} from '@/configs';
import {IPagingParams} from '@/interfaces/api/query';
import {IToken} from '@/interfaces/token';
import {swrFetcher} from '@/utils/swr';
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

export const getTokenDetail = async (address: string): Promise<IToken> => {
  return swrFetcher(`${API_URL}${API_PATH}/token/${address}`, {
    method: 'GET',
    error: 'Fail to get token detail',
  });
}

export interface IUpdateTokenPayload {
  description?: string;
  name?: string;
  social? : {
    discord?: string;
    instagram?: string;
    medium?: string;
    telegram?: string;
    twitter?: string;
    website?: string;
  };
  symbol?: string;
  thumbnail?: string;
}

export interface IUpdateTokenResponse {
  error: string | object;
  status: boolean;
  data: {
    status: boolean;
  }
}

export const updateTokenInfo = (address: string, payload: IUpdateTokenPayload): Promise<IUpdateTokenResponse> => {
  return swrFetcher(`${API_URL}${API_PATH}/token/${address}`, {
    method: 'PUT',
    data: payload,
    error: 'Failed to update token info',
  });
};