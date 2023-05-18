import axios from './axios';
import useSWR from 'swr';

const fetcher = (url: string) => axios.get(url).then(res => res.data);

const useGetApi = <T>(url: string): T | undefined => {
  const { data } = useSWR<T>(url, fetcher);
  return data;
};

export { fetcher, useGetApi };