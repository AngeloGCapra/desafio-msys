import type { ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function Layout({ children }: { children: ReactNode }) {
  const { usuario, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="flex items-center justify-between bg-white px-6 py-4 shadow-sm">
        <h1 className="text-lg font-semibold text-gray-800">Usuarios</h1>
        <div className="flex items-center gap-4 text-sm">
          {usuario && <span className="text-gray-500">{usuario.nome}</span>}
          <button onClick={logout} className="font-medium text-indigo-600 hover:underline">
            Sair
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-10">{children}</main>
    </div>
  );
}
