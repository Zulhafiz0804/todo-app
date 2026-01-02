import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (email, username, password) =>
    api.post('/auth/register', { email, username, password }),
  login: (email, password) =>
    api.post('/auth/login', { email, password })
};

export const todoAPI = {
  create: (userId, title, description) =>
    api.post('/todos', { userId, title, description }),
  getUserTodos: (userId) =>
    api.get(`/todos/user/${userId}`),
  update: (id, title, description, completed) =>
    api.put(`/todos/${id}`, { title, description, completed }),
  delete: (id) =>
    api.delete(`/todos/${id}`),
  getCompleted: (userId) =>
    api.get(`/todos/user/${userId}/completed`),
  getPending: (userId) =>
    api.get(`/todos/user/${userId}/pending`)
};

export default api;