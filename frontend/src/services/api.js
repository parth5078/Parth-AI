import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const chatAPI = {
  getChats: () => api.get('/chat'),
  getChat: (id) => api.get(`/chat/${id}`),
  createChat: (data) => api.post('/chat', data),
  sendMessage: (data) => api.post('/chat/message', data),
  deleteChat: (id) => api.delete(`/chat/${id}`),
  updateChat: (id, data) => api.put(`/chat/${id}`, data),
};

export default api;
