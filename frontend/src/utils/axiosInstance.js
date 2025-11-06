import axios from 'axios'
import { BASE_URL } from './apiPaths'

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

//request interceptors
axiosInstance.interceptors.request.use(
    (config) => {
       const accessToken = localStorage.getItem('token');
       if (accessToken) {
           config.headers.Authorization = `Bearer ${accessToken}`;
       }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// response interceptors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with a status code
      if (error.response.status === 401) {
        window.location.href = '/';
      } else if (error.response.status === 500) {
        console.error('Server error:', error.response.data);
      } else {
        console.error(
          `API Error [${error.response.status}]:`,
          error.response.data?.message || error.response.data
        );
      }
    } else if (error.code === 'ECONNABORTED') {
      // Timeout error
      console.error('Request timeout:', error.message);
    } else {
      // Network or other unknown error
      console.error('Network/Unknown error:', error.message);
    }

    return Promise.reject(error);
  }
);


export default axiosInstance;
