/* eslint-disable @typescript-eslint/no-explicit-any */

import {API_EXCHANGE_URL} from '@/configs';
import {swrFetcher} from '@/utils/swr';
import queryString from 'query-string';
import {IPosition} from "@/interfaces/position";

const API_PATH = '/swap-v3';

export const getListUserPositions = async (
  params: any
): Promise<IPosition[]> => {
  const qs = '?' + queryString.stringify(params);
  return swrFetcher(`${API_EXCHANGE_URL}${API_PATH}/pool/user-position${qs}`, {
    method: 'GET',
    error: 'Fail to get list user positions',
  });
};

export const getPositionDetail = async (
  id: number
): Promise<IPosition> => {
  return swrFetcher(`${API_EXCHANGE_URL}${API_PATH}/pool/user-position/${id}`, {
    method: 'GET',
    error: 'Fail to get list user positions',
  });
};

export const scanTrx = async (params: { tx_hash: string }) => {
  const qs = '?' + queryString.stringify(params);
  return await swrFetcher(`${API_EXCHANGE_URL}/sync${API_PATH}/scan-transaction-hash${qs}`, {
    method: 'GET',
    error: 'Fail to scan tx',
  });
};

export interface ISurroundingTicksParams {
  pool_address: string;
  lower_tick: number;
  upper_tick: number;
}

export const getSurroundingTicks = async (
  params: ISurroundingTicksParams
): Promise<any> => {
  const qs = '?' + queryString.stringify(params);
  return swrFetcher(`${API_EXCHANGE_URL}${API_PATH}/pool/surrounding-ticks${qs}`, {
    method: 'GET',
    error: 'Fail to get list user positions',
  });
};
