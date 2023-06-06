import {API_EXCHANGE_URL, API_URL} from '@/configs';
import createAxiosInstance from './http-client';
import {swrFetcher} from "@/utils/swr";

// Can create multiple axios instances with different base URL
export const apiClient = createAxiosInstance({ baseURL: API_URL });

export const getConfigs = async () => {
  return swrFetcher(`${API_EXCHANGE_URL}/configs`, {
    method: 'GET',
    error: 'getConfigs fail',
  });
};
