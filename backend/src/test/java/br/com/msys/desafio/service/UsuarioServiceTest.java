package br.com.msys.desafio.service;

import br.com.msys.desafio.dto.UsuarioRequest;
import br.com.msys.desafio.dto.UsuarioResponse;
import br.com.msys.desafio.dto.UsuarioUpdateRequest;
import br.com.msys.desafio.entity.Usuario;
import br.com.msys.desafio.exception.EmailJaCadastradoException;
import br.com.msys.desafio.exception.UsuarioNaoEncontradoException;
import br.com.msys.desafio.repository.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

    @Mock
    private UsuarioRepository repository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UsuarioService service;

    private Usuario usuarioExistente() {
        return new Usuario(1, "Ana", "ana@exemplo.com", "hash-antigo");
    }

    @Test
    void criar_deveSalvarComSenhaHasheadaENaoVazarSenha() {
        when(repository.existsByEmail("ana@exemplo.com")).thenReturn(false);
        when(passwordEncoder.encode("senha123")).thenReturn("hash-novo");
        when(repository.save(any(Usuario.class))).thenAnswer(inv -> {
            Usuario u = inv.getArgument(0);
            u.setId(1);
            return u;
        });

        UsuarioResponse response = service.criar(new UsuarioRequest("Ana", "ana@exemplo.com", "senha123"));

        assertThat(response.id()).isEqualTo(1);
        assertThat(response.nome()).isEqualTo("Ana");
        assertThat(response.email()).isEqualTo("ana@exemplo.com");

        ArgumentCaptor<Usuario> captor = ArgumentCaptor.forClass(Usuario.class);
        verify(repository).save(captor.capture());
        assertThat(captor.getValue().getSenha()).isEqualTo("hash-novo");
    }

    @Test
    void criar_comEmailDuplicado_deveLancarExcecao() {
        when(repository.existsByEmail("ana@exemplo.com")).thenReturn(true);

        assertThatThrownBy(() -> service.criar(new UsuarioRequest("Ana", "ana@exemplo.com", "senha123")))
                .isInstanceOf(EmailJaCadastradoException.class);

        verify(repository, never()).save(any());
    }

    @Test
    void atualizar_deveAtualizarDadosEReencodarSenhaQuandoInformada() {
        when(repository.findById(1)).thenReturn(Optional.of(usuarioExistente()));
        when(repository.existsByEmailAndIdNot("novo@exemplo.com", 1)).thenReturn(false);
        when(passwordEncoder.encode("novaSenha")).thenReturn("hash-novo");
        when(repository.save(any(Usuario.class))).thenAnswer(inv -> inv.getArgument(0));

        UsuarioResponse response = service.atualizar(1,
                new UsuarioUpdateRequest("Ana Maria", "novo@exemplo.com", "novaSenha"));

        assertThat(response.nome()).isEqualTo("Ana Maria");
        assertThat(response.email()).isEqualTo("novo@exemplo.com");
        verify(passwordEncoder).encode("novaSenha");
    }

    @Test
    void atualizar_comSenhaNula_naoDeveReencodar() {
        when(repository.findById(1)).thenReturn(Optional.of(usuarioExistente()));
        when(repository.existsByEmailAndIdNot("novo@exemplo.com", 1)).thenReturn(false);
        when(repository.save(any(Usuario.class))).thenAnswer(inv -> inv.getArgument(0));

        service.atualizar(1, new UsuarioUpdateRequest("Ana Maria", "novo@exemplo.com", null));

        verify(passwordEncoder, never()).encode(any());
    }

    @Test
    void atualizar_comEmailDeOutroUsuario_deveLancarConflito() {
        when(repository.findById(1)).thenReturn(Optional.of(usuarioExistente()));
        when(repository.existsByEmailAndIdNot("ocupado@exemplo.com", 1)).thenReturn(true);

        assertThatThrownBy(() -> service.atualizar(1,
                new UsuarioUpdateRequest("Ana", "ocupado@exemplo.com", null)))
                .isInstanceOf(EmailJaCadastradoException.class);

        verify(repository, never()).save(any());
    }

    @Test
    void atualizar_inexistente_deveLancarNaoEncontrado() {
        when(repository.findById(99)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.atualizar(99,
                new UsuarioUpdateRequest("Ana", "ana@exemplo.com", null)))
                .isInstanceOf(UsuarioNaoEncontradoException.class);
    }

    @Test
    void buscarPorId_inexistente_deveLancarNaoEncontrado() {
        when(repository.findById(99)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.buscarPorId(99))
                .isInstanceOf(UsuarioNaoEncontradoException.class);
    }

    @Test
    void excluir_existente_deveChamarDelete() {
        Usuario usuario = usuarioExistente();
        when(repository.findById(1)).thenReturn(Optional.of(usuario));

        service.excluir(1);

        verify(repository).delete(usuario);
    }

    @Test
    void excluir_inexistente_deveLancarNaoEncontrado() {
        when(repository.findById(99)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.excluir(99))
                .isInstanceOf(UsuarioNaoEncontradoException.class);
    }

    @Test
    void listar_deveMapearTodos() {
        when(repository.findAll()).thenReturn(List.of(
                new Usuario(1, "Ana", "ana@exemplo.com", "h1"),
                new Usuario(2, "Bia", "bia@exemplo.com", "h2")));

        List<UsuarioResponse> lista = service.listar();

        assertThat(lista).hasSize(2);
        assertThat(lista).extracting(UsuarioResponse::email)
                .containsExactly("ana@exemplo.com", "bia@exemplo.com");
    }
}
