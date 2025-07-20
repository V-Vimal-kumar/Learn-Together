import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export const useAxiosAuth = () => {
  const { accessToken } = useAuth();

  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
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
