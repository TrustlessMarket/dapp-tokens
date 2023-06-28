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
