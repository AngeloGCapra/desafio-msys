import api from './api';
import { setAuth, clearAuth } from './storage';
import type { AuthResponse } from '../types';

export async function register(
  nome: string,
  email: string,
  senha: string,
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/api/auth/register', { nome, email, senha });
  setAuth(data.token, data.usuario);
  return data;
}

export async function login(email: string, senha: string): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/api/auth/login', { email, senha });
  setAuth(data.token, data.usuario);
  return data;
}

export function logout(): void {
  clearAuth();
}
