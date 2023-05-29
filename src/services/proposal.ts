/* eslint-disable @typescript-eslint/no-explicit-any */
import {API_EXCHANGE_URL} from '@/configs';
import {swrFetcher} from '@/utils/swr';

const API_PATH = '/proposal';

export const getListProposals = async () => {
  return swrFetcher(`${API_EXCHANGE_URL}${API_PATH}/list`, {
    method: 'GET',
    error: 'getListProposals fail',
  });
};