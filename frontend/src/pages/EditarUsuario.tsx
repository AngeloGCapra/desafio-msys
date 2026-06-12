import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2, UserPen } from 'lucide-react';
import { useToast } from '../hooks/useToast';
import { getErrorMessage } from '../services/api';
import * as usuarioService from '../services/usuarioService';
import Layout from '../components/Layout';
import TextField from '../components/TextField';
import Button from '../components/Button';
import Alert from '../components/Alert';

interface EditarForm {
  nome: string;
  email: string;
  senha: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EditarUsuario() {
  const { id } = useParams();
  const usuarioId = Number(id);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditarForm>();

  const [loading, setLoading] = useState(true);
  const [carregarErro, setCarregarErro] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    usuarioService
      .buscarPorId(usuarioId)
      .then((u) => reset({ nome: u.nome, email: u.email, senha: '' }))
      .catch((e) => setCarregarErro(getErrorMessage(e, 'Usuario nao encontrado.')))
      .finally(() => setLoading(false));
  }, [usuarioId, reset]);

  const onSubmit = async (data: EditarForm) => {
    setErro(null);
    try {
      await usuarioService.atualizar(usuarioId, {
        nome: data.nome,
        email: data.email,
        senha: data.senha,
      });
      showToast('Usuario atualizado', 'success');
      navigate('/usuarios');
    } catch (e) {
      setErro(getErrorMessage(e));
    }
  };

  return (
    <Layout>
      <div className="animate-fade-in mx-auto max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-gray-800">
          <UserPen size={20} className="text-indigo-600" aria-hidden />
          Editar usuario
        </h2>

        {loading ? (
          <div className="flex items-center gap-2 text-gray-500">
            <Loader2 size={18} className="animate-spin" aria-hidden />
            Carregando...
          </div>
        ) : carregarErro ? (
          <div className="flex flex-col gap-4">
            <Alert message={carregarErro} />
            <button
              onClick={() => navigate('/usuarios')}
              className="text-sm font-medium text-indigo-600 hover:underline"
            >
              Voltar para a lista
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
            {erro && <Alert message={erro} />}
            <TextField
              id="nome"
              label="Nome"
              error={errors.nome?.message}
              {...register('nome', {
                required: 'Informe o nome.',
                maxLength: { value: 255, message: 'Maximo de 255 caracteres.' },
              })}
            />
            <TextField
              id="email"
              type="email"
              label="E-mail"
              error={errors.email?.message}
              {...register('email', {
                required: 'Informe o e-mail.',
                pattern: { value: EMAIL_PATTERN, message: 'E-mail invalido.' },
              })}
            />
            <TextField
              id="senha"
              type="password"
              label="Nova senha (opcional)"
              error={errors.senha?.message}
              {...register('senha', {
                minLength: { value: 6, message: 'Minimo de 6 caracteres.' },
              })}
            />
            <p className="-mt-2 text-xs text-gray-500">
              Deixe em branco para manter a senha atual.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate('/usuarios')}
                className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-150 hover:bg-gray-50 active:scale-[.98]"
              >
                Cancelar
              </button>
              <div className="flex-1">
                <Button type="submit" loading={isSubmitting}>
                  Salvar
                </Button>
              </div>
            </div>
          </form>
        )}
      </div>
    </Layout>
  );
}
