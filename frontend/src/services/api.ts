import axios, { AxiosError } from 'axios';
import type { ApiError } from '../types';
import { getToken, clearAuth } from './storage';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080',
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      clearAuth();
      if (window.location.pathname !== '/login') {
        window.location.assign('/login');
      }
    }
    return Promise.reject(error);
  },
);

// Extrai a mensagem mais util de um erro da API (fields de validacao -> message -> fallback).
export function getErrorMessage(
  error: unknown,
  fallback = 'Ocorreu um erro. Tente novamente.',
): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiError | undefined;
    if (data?.fields) {
      const first = Object.values(data.fields)[0];
      if (first) return first;
    }
    if (data?.message) return data.message;
  }
  return fallback;
}

export default api;
