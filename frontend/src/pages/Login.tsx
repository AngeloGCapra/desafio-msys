import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { getErrorMessage } from '../services/api';
import AuthLayout from '../components/AuthLayout';
import TextField from '../components/TextField';
import Button from '../components/Button';
import Alert from '../components/Alert';

interface LoginForm {
  email: string;
  senha: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [erro, setErro] = useState<string | null>(null);

  const onSubmit = async (data: LoginForm) => {
    setErro(null);
    try {
      await login(data.email, data.senha);
      navigate('/usuarios');
    } catch (e) {
      setErro(getErrorMessage(e, 'E-mail ou senha invalidos.'));
    }
  };

  return (
    <AuthLayout title="Entrar" icon={<LogIn size={24} aria-hidden />}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        {erro && <Alert message={erro} />}
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
          {...register('senha', { required: 'Informe a senha.' })}
        />
        <Button type="submit" loading={isSubmitting}>
          Entrar
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        Nao tem conta?{' '}
        <Link to="/cadastro" className="font-medium text-indigo-600 hover:underline">
          Cadastre-se
        </Link>
      </p>
    </AuthLayout>
  );
}
