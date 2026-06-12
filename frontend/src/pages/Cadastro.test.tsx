import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Cadastro from './Cadastro';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return { ...actual, useNavigate: () => mockNavigate };
});

const mockRegister = vi.fn();
vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({ register: mockRegister }),
}));

function renderCadastro() {
  return render(
    <MemoryRouter>
      <Cadastro />
    </MemoryRouter>,
  );
}

describe('Cadastro', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('exibe erros de obrigatorios e nao chama register ao enviar vazio', async () => {
    const user = userEvent.setup();
    renderCadastro();

    await user.click(screen.getByRole('button', { name: /cadastrar/i }));

    expect(await screen.findByText('Informe o nome.')).toBeInTheDocument();
    expect(screen.getByText('Informe o e-mail.')).toBeInTheDocument();
    expect(screen.getByText('Informe a senha.')).toBeInTheDocument();
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('valida o formato do e-mail', async () => {
    const user = userEvent.setup();
    renderCadastro();

    await user.type(screen.getByLabelText('Nome'), 'Ana');
    await user.type(screen.getByLabelText('E-mail'), 'invalido');
    await user.type(screen.getByLabelText('Senha'), 'senha123');
    await user.click(screen.getByRole('button', { name: /cadastrar/i }));

    expect(await screen.findByText('E-mail invalido.')).toBeInTheDocument();
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('envia os dados e redireciona quando valido', async () => {
    mockRegister.mockResolvedValueOnce(undefined);
    const user = userEvent.setup();
    renderCadastro();

    await user.type(screen.getByLabelText('Nome'), 'Ana');
    await user.type(screen.getByLabelText('E-mail'), 'ana@exemplo.com');
    await user.type(screen.getByLabelText('Senha'), 'senha123');
    await user.click(screen.getByRole('button', { name: /cadastrar/i }));

    await waitFor(() =>
      expect(mockRegister).toHaveBeenCalledWith('Ana', 'ana@exemplo.com', 'senha123'),
    );
    expect(mockNavigate).toHaveBeenCalledWith('/usuarios');
  });
});
