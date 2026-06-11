import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Usuario } from '../types';
import * as authService from '../services/authService';
import { getToken, getUsuario } from '../services/storage';

interface AuthContextValue {
  usuario: Usuario | null;
  isAuthenticated: boolean;
  login: (email: string, senha: string) => Promise<void>;
  register: (nome: string, email: string, senha: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(getUsuario());
  const [token, setToken] = useState<string | null>(getToken());

  const login = async (email: string, senha: string) => {
    const data = await authService.login(email, senha);
    setUsuario(data.usuario);
    setToken(data.token);
  };

  const register = async (nome: string, email: string, senha: string) => {
    const data = await authService.register(nome, email, senha);
    setUsuario(data.usuario);
    setToken(data.token);
  };

  const logout = () => {
    authService.logout();
    setUsuario(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, isAuthenticated: !!token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return ctx;
}
