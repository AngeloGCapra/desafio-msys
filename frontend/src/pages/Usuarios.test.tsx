import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Usuarios from './Usuarios';
import * as usuarioService from '../services/usuarioService';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({ usuario: { id: 1, nome: 'Ana', email: 'ana@exemplo.com' }, logout: vi.fn() }),
}));

const mockShowToast = vi.fn();
vi.mock('../hooks/useToast', () => ({
  useToast: () => ({ showToast: mockShowToast }),
}));

vi.mock('../services/usuarioService', () => ({
  listar: vi.fn(),
  excluir: vi.fn(),
}));

const usuarios = [
  { id: 1, nome: 'Ana', email: 'ana@exemplo.com' },
  { id: 2, nome: 'Bruno', email: 'bruno@exemplo.com' },
];

function renderUsuarios() {
  return render(
    <MemoryRouter>
      <Usuarios />
    </MemoryRouter>,
  );
}

describe('Usuarios', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza a lista e oculta Excluir na linha do proprio usuario', async () => {
    vi.mocked(usuarioService.listar).mockResolvedValueOnce(usuarios);
    renderUsuarios();

    expect(await screen.findByText('Bruno')).toBeInTheDocument();
    expect(screen.getByText('ana@exemplo.com')).toBeInTheDocument();
    // Ana (id 1) e o usuario logado: so deve existir 1 botao Excluir (linha do Bruno).
    expect(screen.getAllByRole('button', { name: 'Excluir' })).toHaveLength(1);
  });

  it('exclui um usuario apos confirmar no modal e dispara o toast', async () => {
    vi.mocked(usuarioService.listar).mockResolvedValueOnce(usuarios);
    vi.mocked(usuarioService.excluir).mockResolvedValueOnce(undefined);
    const user = userEvent.setup();
    renderUsuarios();

    await user.click(await screen.findByRole('button', { name: 'Excluir' }));

    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText(/Bruno/)).toBeInTheDocument();
    await user.click(within(dialog).getByRole('button', { name: 'Excluir' }));

    await waitFor(() => expect(usuarioService.excluir).toHaveBeenCalledWith(2));
    await waitFor(() => expect(screen.queryByText('Bruno')).not.toBeInTheDocument());
    expect(mockShowToast).toHaveBeenCalledWith('Usuario excluido', 'success');
  });
});
