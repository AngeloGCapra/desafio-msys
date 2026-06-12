import { useAuth } from '../hooks/useAuth';

export default function Usuarios() {
  const { usuario, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="flex items-center justify-between bg-white px-6 py-4 shadow-sm">
        <h1 className="text-lg font-semibold text-gray-800">Usuarios</h1>
        <button
          onClick={logout}
          className="text-sm font-medium text-indigo-600 hover:underline"
        >
          Sair
        </button>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-10">
        <p className="text-gray-700">
          Bem-vindo, <span className="font-medium">{usuario?.nome}</span>.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          A listagem com editar e excluir sera implementada na Fase 5.
        </p>
      </main>
    </div>
  );
}
