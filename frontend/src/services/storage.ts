import type { Usuario } from '../types';

const TOKEN_KEY = 'token';
const USER_KEY = 'usuario';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUsuario(): Usuario | null {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? (JSON.parse(raw) as Usuario) : null;
}

export function setAuth(token: string, usuario: Usuario): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(usuario));
}

export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
