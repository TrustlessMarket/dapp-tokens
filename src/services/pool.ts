import { API_URL } from '@/configs';
import { isProduction } from '@/utils/commons';
import { swrFetcher } from '@/utils/swr';
import queryString from 'query-string';

const API_PATH = '/swap';

export const getPairAPR = async (params: { pair: string }) => {
  if (!isProduction()) {
    return Promise.resolve(0);
  }

  const qs = '?' + queryString.stringify(params);
  return swrFetcher(`${API_URL}${API_PATH}/pair/apr${qs}`, {
    method: 'GET',
    error: 'Fail to scan tx',
  });
};
