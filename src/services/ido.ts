/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_URL } from '@/configs';
import { IPagingParams } from '@/interfaces/api/query';
import { swrFetcher } from '@/utils/swr';
import queryString from 'query-string';
import {camelCaseKeys} from "@/utils";

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

export interface IGMDepositInfoListItemResponse {
  from: string;
  to: string;
  value: string;
  usdtValue: number;
  percent: number;
  currency: string;
  extraPercent: number;
  gmReceive: number;
  usdtValueExtra: number;
  avatar: string;
  ens: string;
}

export interface IGMDepositInfoListItem extends IGMDepositInfoListItemResponse {
  index: number;
  isCurrentUser: boolean;
  depositTokens?: {
    turbo: {
      amount: number;
      value: number;
    };
    pepe: {
      amount: number;
      value: number;
    };
    eth: {
      amount: number;
      value: number;
    };
    btc: {
      amount: number;
      value: number;
    };
  };
  top10GapUsdValue: number;
  oneGMGapUsdValue: number;
}

export interface ITokenDeposit {
  name: 'eth' | 'btc' | 'turbo' | 'pepe';
  value: string;
  usdtValue: number;
}

export interface IGMDepositInfoResponse {
  usdtValue: number;
  items: Array<IGMDepositInfoListItem>;
  mapTokensDeposit: {
    [key: string]: ITokenDeposit[];
  };
}

export const getGMDepositInfo = async (): Promise<IGMDepositInfoResponse> => {
  try {
    const res = await swrFetcher(`${"https://generative.xyz/generative/api"}/charts/gm-collections/deposit`, {
      method: 'GET',
      error: 'Fail to get deposit address',
    });
    return Object(camelCaseKeys(res));
  } catch (err: unknown) {
    console.log(err);
    throw Error('Failed to get GM deposit info.');
  }
};
