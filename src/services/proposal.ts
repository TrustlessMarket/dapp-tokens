/* eslint-disable @typescript-eslint/no-explicit-any */
import {API_EXCHANGE_URL} from '@/configs';
import {swrFetcher} from '@/utils/swr';
import {IPagingParams} from "@/interfaces/api/query";
import queryString from "query-string";

const API_PATH = '/proposal';

export const getListProposals = async (params: IPagingParams) => {
  const qs = '?' + queryString.stringify(params);
  return swrFetcher(`${API_EXCHANGE_URL}${API_PATH}/list${qs}`, {
    method: 'GET',
    error: 'getListProposals fail',
  });
};