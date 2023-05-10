/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_URL } from '@/configs';
import { IPagingParams } from '@/interfaces/api/query';
import { swrFetcher } from '@/utils/swr';
import queryString from 'query-string';

const API_PATH = '/swap';

export const getListTokenForIdo = async (
  params: { owner: string } & IPagingParams,
) => {
  const qs = '?' + queryString.stringify(params);
  return swrFetcher(`${API_URL}${API_PATH}/ido/tokens${qs}`, {
    method: 'GET',
    error: 'Fail to scan tx',
  });
};

export const getListIdo = async (params: IPagingParams) => {
  const qs = '?' + queryString.stringify(params);
  return swrFetcher(`${API_URL}${API_PATH}/ido/list${qs}`, {
    method: 'GET',
    error: 'Fail to scan tx',
  });
};

export const getDetailIdo = async (params: { id: any }) => {
  const qs = '?' + queryString.stringify(params);
  return swrFetcher(`${API_URL}${API_PATH}/ido/detail${qs}`, {
    method: 'GET',
    error: 'Fail to scan tx',
  });
};

export const removeIdo = async (params: {
  id: any;
  signature: any;
  address: any;
}) => {
  const qs = '?' + queryString.stringify(params);
  return swrFetcher(`${API_URL}${API_PATH}/ido/delete${qs}`, {
    method: 'DELETE',
    error: 'Fail to scan tx',
  });
};

export const submitIdo = async (data: {
  id?: string;
  token_address: string;
  user_wallet_address: string;
  start_at: string;
  signature: string;
  price?: string;
}) => {
  return swrFetcher(`${API_URL}${API_PATH}/ido/`, {
    method: 'POST',
    data: data,
    error: 'Fail to scan tx',
  });
};
