import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Pencil, Trash2, Users } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { getErrorMessage } from '../services/api';
import * as usuarioService from '../services/usuarioService';
import type { Usuario } from '../types';
import Layout from '../components/Layout';
import Alert from '../components/Alert';
import ConfirmDialog from '../components/ConfirmDialog';

export default function Usuarios() {
  const { usuario: atual } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selecionado, setSelecionado] = useState<Usuario | null>(null);
  const [excluindo, setExcluindo] = useState(false);

  useEffect(() => {
    usuarioService
      .listar()
      .then(setUsuarios)
      .catch((e) => setError(getErrorMessage(e, 'Nao foi possivel carregar os usuarios.')))
      .finally(() => setLoading(false));
  }, []);

  const confirmarExclusao = async () => {
    if (!selecionado) return;
    setExcluindo(true);
    try {
      await usuarioService.excluir(selecionado.id);
      setUsuarios((prev) => prev.filter((u) => u.id !== selecionado.id));
      showToast('Usuario excluido', 'success');
      setSelecionado(null);
    } catch (e) {
      showToast(getErrorMessage(e, 'Nao foi possivel excluir.'), 'error');
    } finally {
      setExcluindo(false);
    }
  };

  return (
    <Layout>
      {error && <Alert message={error} />}

      {loading ? (
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 size={18} className="animate-spin" aria-hidden />
          Carregando...
        </div>
      ) : usuarios.length === 0 && !error ? (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-gray-300 bg-white py-12 text-gray-500">
          <Users size={32} className="text-gray-400" aria-hidden />
          Nenhum usuario cadastrado.
        </div>
      ) : (
        <div className="animate-fade-in overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 font-medium">Nome</th>
                <th className="px-4 py-3 font-medium">E-mail</th>
                <th className="px-4 py-3 text-right font-medium">Acoes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {usuarios.map((u) => (
                <tr key={u.id} className="transition-colors duration-150 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{u.nome}</td>
                  <td className="px-4 py-3 text-gray-600">{u.email}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-4">
                      <button
                        onClick={() => navigate(`/usuarios/${u.id}/editar`)}
                        className="flex items-center gap-1 font-medium text-indigo-600 transition-colors hover:text-indigo-700"
                      >
                        <Pencil size={14} aria-hidden />
                        Editar
                      </button>
                      {u.id !== atual?.id && (
                        <button
                          onClick={() => setSelecionado(u)}
                          className="flex items-center gap-1 font-medium text-red-600 transition-colors hover:text-red-700"
                        >
                          <Trash2 size={14} aria-hidden />
                          Excluir
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={selecionado !== null}
        title="Excluir usuario"
        message={`Tem certeza que deseja excluir ${selecionado?.nome}? Esta acao nao pode ser desfeita.`}
        confirmLabel="Excluir"
        loading={excluindo}
        onConfirm={confirmarExclusao}
        onCancel={() => setSelecionado(null)}
      />
    </Layout>
  );
}
