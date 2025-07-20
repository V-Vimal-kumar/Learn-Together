import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export const useAxiosAuth = () => {
  const { accessToken } = useAuth();

  const instance = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true,
  });

  instance.interceptors.request.use((config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  });

  return instance;
};
