import api from './api';
import type { Usuario } from '../types';

export interface UsuarioInput {
  nome: string;
  email: string;
  senha?: string;
}

export async function listar(): Promise<Usuario[]> {
  const { data } = await api.get<Usuario[]>('/api/usuarios');
  return data;
}

export async function buscarPorId(id: number): Promise<Usuario> {
  const { data } = await api.get<Usuario>(`/api/usuarios/${id}`);
  return data;
}

export async function atualizar(id: number, input: UsuarioInput): Promise<Usuario> {
  const body: UsuarioInput = { nome: input.nome, email: input.email };
  if (input.senha) {
    body.senha = input.senha;
  }
  const { data } = await api.put<Usuario>(`/api/usuarios/${id}`, body);
  return data;
}

export async function excluir(id: number): Promise<void> {
  await api.delete(`/api/usuarios/${id}`);
}
