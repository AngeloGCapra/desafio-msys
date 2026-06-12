import type { ReactNode } from 'react';
import { LogOut, Users } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Layout({ children }: { children: ReactNode }) {
  const { usuario, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 shadow-sm">
        <h1 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
          <Users size={20} className="text-indigo-600" aria-hidden />
          Usuarios
        </h1>
        <div className="flex items-center gap-3 text-sm">
          {usuario && (
            <span className="flex items-center gap-2 text-gray-600">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
                {usuario.nome.charAt(0).toUpperCase()}
              </span>
              {usuario.nome}
            </span>
          )}
          <button
            onClick={logout}
            className="flex items-center gap-1 rounded-md px-2 py-1 font-medium text-indigo-600 transition-colors duration-150 hover:bg-indigo-50"
          >
            <LogOut size={16} aria-hidden />
            Sair
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-10">{children}</main>
    </div>
  );
}
