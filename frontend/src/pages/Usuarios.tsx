import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
        <p className="text-gray-500">Carregando...</p>
      ) : usuarios.length === 0 && !error ? (
        <p className="text-gray-500">Nenhum usuario cadastrado.</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
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
                <tr key={u.id}>
                  <td className="px-4 py-3 text-gray-800">{u.nome}</td>
                  <td className="px-4 py-3 text-gray-600">{u.email}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => navigate(`/usuarios/${u.id}/editar`)}
                      className="font-medium text-indigo-600 hover:underline"
                    >
                      Editar
                    </button>
                    {u.id !== atual?.id && (
                      <button
                        onClick={() => setSelecionado(u)}
                        className="ml-4 font-medium text-red-600 hover:underline"
                      >
                        Excluir
                      </button>
                    )}
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
