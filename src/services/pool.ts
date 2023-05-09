import { API_URL } from '@/configs';
import { swrFetcher } from '@/utils/swr';
import queryString from 'query-string';

const API_PATH = '/swap';

export const getPairAPR = async (params: { pair: string }) => {
  const qs = '?' + queryString.stringify(params);
  return swrFetcher(`${API_URL}${API_PATH}/pair/apr${qs}`, {
    method: 'GET',
    error: 'Fail to scan tx',
  });
};
