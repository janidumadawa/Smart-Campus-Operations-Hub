// frontend/src/utils/axiosConfig.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://smart-campus-backend-v9eg.onrender.com/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default instance;

export const API_ORIGIN = 'https://smart-campus-backend-v9eg.onrender.com';
