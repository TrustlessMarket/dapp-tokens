/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_EXCHANGE_URL } from '@/configs';
import { IPagingParams } from '@/interfaces/api/query';
import { swrFetcher } from '@/utils/swr';
import queryString from 'query-string';

const API_PATH = '/launchpad';

export const getListLiquidityToken = async (params: IPagingParams) => {
  const qs = '?' + queryString.stringify(params);
  return swrFetcher(`${API_EXCHANGE_URL}${API_PATH}/liquidity-token${qs}`, {
    method: 'GET',
    error: 'getListLiquidityToken',
  });
};

export const getListOwnerToken = async (
  params: { address?: string } & IPagingParams,
) => {
  const qs = '?' + queryString.stringify(params);
  return swrFetcher(`${API_EXCHANGE_URL}${API_PATH}/launchpad-token${qs}`, {
    method: 'GET',
    error: 'getListLiquidityToken',
  });
};

export const scanLaunchpadTxHash = async (params: { tx_hash: string, network?: string }) => {
  const qs = '?' + queryString.stringify(params);
  return swrFetcher(
    `${API_EXCHANGE_URL}/sync${API_PATH}/scan-transaction-hash${qs}`,
    {
      method: 'GET',
      error: 'getListLiquidityToken',
    },
  );
};

export const getListLaunchpad = async (
  params: { address?: string; network?: string } & IPagingParams,
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
  network?: any;
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
  network?: string;
}) => {
  const qs = '?network=tc&' + queryString.stringify(params);
  return swrFetcher(`${API_EXCHANGE_URL}/users/boost${qs}`, {
    method: 'GET',
    error: 'getListLiquidityToken',
  });
};

export const createLaunchpad = async (
  data: {
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
    threshold_balance: string;
    twitter_post_url: string;
    id?: string;
    duration: number;
  },
  params?: IPagingParams,
) => {
  const qs = '?' + queryString.stringify(params || {});
  return swrFetcher(`${API_EXCHANGE_URL}${API_PATH}/create-update-launchpad${qs}`, {
    method: 'POST',
    data,
    error: 'getListLiquidityToken',
  });
};

export const getDepositResultLaunchpad = async (params: {
  pool_address?: any;
  network?: string;
}) => {
  const qs = '?' + queryString.stringify(params);
  return swrFetcher(`${API_EXCHANGE_URL}${API_PATH}/result${qs}`, {
    method: 'GET',
    error: 'Fail to get deposit address',
  });
};

export const getUserDepositInfoLaunchpad = async (params: {
  pool_address?: any;
  address?: any;
  network?: string;
}) => {
  const qs = '?' + queryString.stringify(params);
  return swrFetcher(`${API_EXCHANGE_URL}${API_PATH}/user-result${qs}`, {
    method: 'GET',
    error: 'Fail to get deposit address',
  });
};

export const importBoost = async (
  params: {
    pool_address?: any;
    address?: any;
    network?: any;
  },
  data: {
    signature: string;
    file_url: string;
  },
) => {
  const qs = '?' + queryString.stringify(params);
  return swrFetcher(`${API_EXCHANGE_URL}${API_PATH}/import-boost${qs}`, {
    method: 'POST',
    data,
    error: 'Fail to get deposit address',
  });
};

export const getVoteResultLaunchpad = async (params: {
  pool_address?: any;
  network?: string;
}) => {
  const qs = '?' + queryString.stringify(params);
  return swrFetcher(`${API_EXCHANGE_URL}${API_PATH}/vote-result${qs}`, {
    method: 'GET',
    error: 'getVoteResultLaunchpad fail',
  });
};

export const getLaunchpadDepositAddress = async (params: {
  network?: string;
  address?: string;
  launchpad_id?: string;
}) => {
  const qs = '?' + queryString.stringify(params);
  return swrFetcher(`${API_EXCHANGE_URL}${API_PATH}/deposit-address${qs}`, {
    method: 'GET',
    error: 'getLaunchpadDepositAddress fail',
  });
};

export const getLaunchpadUserResultDetail = async (
  params: { address?: string; pool_address?: string } & IPagingParams,
) => {
  const qs = '?' + queryString.stringify(params);
  return swrFetcher(`${API_EXCHANGE_URL}${API_PATH}/user-result-detail${qs}`, {
    method: 'GET',
    error: 'getLaunchpadUserResultDetail fail',
  });
};
