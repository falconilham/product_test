import axios from 'axios';
// import decrypt from './decrypt'
// import { getCookie } from 'cookies-next';

const axiosDefaultHeader = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
}

// ----------------------------------------------------------------------

const axiosInstance = axios.create({
  headers: axiosDefaultHeader,
});

axiosInstance.interceptors.request.use(async (config) => {
  config.headers = {
    ...config.headers,
  };
  return config;
});

axiosInstance.interceptors.response.use((response) => response, function (error) {
  return Promise.reject(error || 'Something went wrong');
});

export default axiosInstance;