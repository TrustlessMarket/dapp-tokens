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

export const getListOwnerToken = async (
  params: { address: string } & IPagingParams,
) => {
  const qs = '?' + queryString.stringify(params);
  return swrFetcher(`${API_EXCHANGE_URL}${API_PATH}/launchpad-token${qs}`, {
    method: 'GET',
    error: 'getListLiquidityToken',
  });
};

export const scanLaunchpadTxHash = async (params: { tx_hash: string }) => {
  const qs = '?network=tc' + queryString.stringify(params);
  return swrFetcher(
    `${API_EXCHANGE_URL}/sync${API_PATH}/scan-transaction-hash${qs}`,
    {
      method: 'GET',
      error: 'getListLiquidityToken',
    },
  );
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

export const getDetailLaunchpad = async (params: {
  pool_address?: any;
  id?: any;
}) => {
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

export const updateLaunchpadDescription = async (data: {
  launchpad?: string;
  tx_hash?: string;
  user_address: string;
  video: string;
  image: string;
  description: string;
  qand_a: string;
  signature: string;
}) => {
  return swrFetcher(`${API_EXCHANGE_URL}${API_PATH}/update-description`, {
    method: 'POST',
    data,
    error: 'getListLiquidityToken',
  });
};

export const createLaunchpad = async (data: {
  user_address: string;
  video: string;
  image: string;
  description: string;
  qand_a?: string;
  signature: string;
  liquidity_token: string;
  launchpad_token: string;
  launchpad_balance: string;
  liquidity_balance: string;
  liquidity_ratio: string;
  goal_balance: string;
  id?: string;
  duration: number;
}) => {
  return swrFetcher(`${API_EXCHANGE_URL}${API_PATH}/create-update-launchpad`, {
    method: 'POST',
    data,
    error: 'getListLiquidityToken',
  });
};

export const getLaunchpadDepositInfo = async (params: { pool_address?: any }) => {
  const qs = '?' + queryString.stringify(params);
  return swrFetcher(`${API_EXCHANGE_URL}${API_PATH}/result${qs}`, {
    method: 'GET',
    error: 'Fail to get deposit address',
  });
};

export const getLaunchpadUserDepositInfo = async (params: {
  pool_address?: any;
  address?: any;
}) => {
  const qs = '?' + queryString.stringify(params);
  return swrFetcher(`${API_EXCHANGE_URL}${API_PATH}/user-result${qs}`, {
    method: 'GET',
    error: 'Fail to get deposit address',
  });
};
