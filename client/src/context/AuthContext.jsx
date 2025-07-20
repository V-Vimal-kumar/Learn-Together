import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

// Axios base config
axios.defaults.baseURL = 'import.meta.env.VITE_API_URL';
axios.defaults.withCredentials = true;

export const AuthProvider = ({ children }) => {
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState('');
  const navigate = useNavigate();

useEffect(() => {
  const fetchUser = async () => {
    const storedToken = localStorage.getItem('token');

    if (!storedToken) {
      console.info('🕊️ No token found, skipping user fetch.');
      setAuthLoading(false);
      return;
    }

    try {
      let token = storedToken;

      // If token expired or corrupted, try refresh
      const decoded = jwtDecode(token);
      // console.log('🔐 Decoded token:', decoded);

      const userRes = await axios.get(`/users/${decoded.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(userRes.data);
      setAccessToken(token);
      // console.log('👤 User fetched:', userRes.data);
    } catch (err) {
      console.warn('❌ Token invalid or user fetch failed:', err.response?.data || err.message);

      setUser(null);
      setAccessToken('');
      localStorage.removeItem('token');
      // Don't force redirect unless already in a protected route
    } finally {
      setAuthLoading(false);
    }
  };

  fetchUser();
}, []);


  const login = async (email, password) => {
    try {
      const res = await axios.post('/auth/login', { email, password });
      const { accessToken, user } = res.data;

      localStorage.setItem('token', accessToken);
      setUser(user);
      setAccessToken(accessToken);
      navigate('/dashboard');
    } catch (err) {
      console.error('❌ Login failed:', err.response?.data || err.message);
      throw err;
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await axios.post('/auth/register', { name, email, password });
      const { user, accessToken } = res.data;

      localStorage.setItem('token', accessToken);
      setUser(user);
      setAccessToken(accessToken);
      navigate('/dashboard');
    } catch (err) {
      console.error('❌ Register failed:', err.response?.data || err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await axios.post('/auth/logout');
    } catch (err) {
      console.warn('⚠️ Logout API failed (non-blocking):', err.response?.data || err.message);
    } finally {
      setUser(null);
      setAccessToken('');
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, login, register, logout, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
