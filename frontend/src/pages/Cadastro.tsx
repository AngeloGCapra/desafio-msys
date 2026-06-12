import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { getErrorMessage } from '../services/api';
import AuthLayout from '../components/AuthLayout';
import TextField from '../components/TextField';
import Button from '../components/Button';
import Alert from '../components/Alert';

interface CadastroForm {
  nome: string;
  email: string;
  senha: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Cadastro() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CadastroForm>();
  const { register: registrar } = useAuth();
  const navigate = useNavigate();
  const [erro, setErro] = useState<string | null>(null);

  const onSubmit = async (data: CadastroForm) => {
    setErro(null);
    try {
      await registrar(data.nome, data.email, data.senha);
      navigate('/usuarios');
    } catch (e) {
      setErro(getErrorMessage(e));
    }
  };

  return (
    <AuthLayout title="Criar conta" icon={<UserPlus size={24} aria-hidden />}>
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
          label="Senha"
          error={errors.senha?.message}
          {...register('senha', {
            required: 'Informe a senha.',
            minLength: { value: 6, message: 'Minimo de 6 caracteres.' },
          })}
        />
        <Button type="submit" loading={isSubmitting}>
          Cadastrar
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        Ja tem conta?{' '}
        <Link to="/login" className="font-medium text-indigo-600 hover:underline">
          Entrar
        </Link>
      </p>
    </AuthLayout>
  );
}
