import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return { ...actual, useNavigate: () => mockNavigate };
});

const mockLogin = vi.fn();
vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({ login: mockLogin }),
}));

function renderLogin() {
  return render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>,
  );
}

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('autentica e redireciona com credenciais validas', async () => {
    mockLogin.mockResolvedValueOnce(undefined);
    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByLabelText('E-mail'), 'ana@exemplo.com');
    await user.type(screen.getByLabelText('Senha'), 'senha123');
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() =>
      expect(mockLogin).toHaveBeenCalledWith('ana@exemplo.com', 'senha123'),
    );
    expect(mockNavigate).toHaveBeenCalledWith('/usuarios');
  });

  it('mostra mensagem de erro quando o login falha', async () => {
    mockLogin.mockRejectedValueOnce(new Error('falha'));
    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByLabelText('E-mail'), 'ana@exemplo.com');
    await user.type(screen.getByLabelText('Senha'), 'errada');
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
