import axios from 'axios';

const axiosDefaultHeader = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
}

// ----------------------------------------------------------------------

const axiosInstance = axios.create({
  headers: axiosDefaultHeader,
  baseURL: 'https://dummyjson.com/'
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