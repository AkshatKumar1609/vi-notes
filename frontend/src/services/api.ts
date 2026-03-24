import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token to requests if it exists
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (email: string, password: string, passwordConfirm: string) =>
    axiosInstance.post('/auth/register', { email, password, passwordConfirm }),

  login: (email: string, password: string) =>
    axiosInstance.post('/auth/login', { email, password }),

  getMe: () =>
    axiosInstance.get('/auth/me'),
};

export default axiosInstance;
