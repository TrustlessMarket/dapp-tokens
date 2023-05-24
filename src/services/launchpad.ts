/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_EXCHANGE_URL } from '@/configs';
import { IPagingParams } from '@/interfaces/api/query';
import { swrFetcher } from '@/utils/swr';
import queryString from 'query-string';

const API_PATH = '/launchpad';

export const getListLiquidityToken = async () => {
  return swrFetcher(`${API_EXCHANGE_URL}${API_PATH}/liquidity-token`, {
    method: 'GET',
    error: 'getListLiquidityToken',
  });
};

export const getListLaunchpad = async (
  params: { address?: string } & IPagingParams,
) => {
  const qs = '?' + queryString.stringify(params);
  return swrFetcher(`${API_EXCHANGE_URL}${API_PATH}/list${qs}`, {
    method: 'GET',
    error: 'getListLiquidityToken',
  });
};

export const getDetailLaunchpad = async (params: { pool_address?: any }) => {
  const qs = '?' + queryString.stringify(params);
  return swrFetcher(`${API_EXCHANGE_URL}${API_PATH}/detail${qs}`, {
    method: 'GET',
    error: 'getListLiquidityToken',
  });
};

export const getUserBoost = async (params: {
  address?: any;
  pool_address?: any;
}) => {
  const qs = '?network=tc&' + queryString.stringify(params);
  return swrFetcher(`${API_EXCHANGE_URL}/users/boost${qs}`, {
    method: 'GET',
    error: 'getListLiquidityToken',
  });
};
