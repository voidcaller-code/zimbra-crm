import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: adjunta el token JWT a cada request si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor: maneja errores globales de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── AUTH ENDPOINTS ────────────────────────────────────────────────
// Estos endpoints deben ser implementados por el backend.
// Se espera que Django use SimpleJWT o similar.

/**
 * Login de usuario
 * POST /api/auth/login/
 * Body: { username, password }
 * Response esperado: { access, refresh }
 */
export const login = async (username, password) => {
  const response = await api.post('/auth/login/', { username, password });
  const { access, refresh } = response.data;
  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);
  return response.data;
};

/**
 * Registro de usuario
 * POST /api/auth/register/
 * Body: { username, email, password, password_confirm }
 * Response esperado: { id, username, email } o { access, refresh }
 */
export const register = async (userData) => {
  const response = await api.post('/auth/register/', userData);
  return response.data;
};

/**
 * Logout: limpia tokens locales
 */
export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

/**
 * Verifica si el usuario está autenticado
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('access_token');
};

export default api;
