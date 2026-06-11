package br.com.msys.desafio.service;

import br.com.msys.desafio.dto.AuthResponse;
import br.com.msys.desafio.dto.LoginRequest;
import br.com.msys.desafio.dto.UsuarioRequest;
import br.com.msys.desafio.dto.UsuarioResponse;
import br.com.msys.desafio.entity.Usuario;
import br.com.msys.desafio.repository.UsuarioRepository;
import br.com.msys.desafio.security.JwtService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UsuarioService usuarioService;

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthService authService;

    @Test
    void register_deveCriarUsuarioEGerarToken() {
        UsuarioResponse criado = new UsuarioResponse(1, "Ana", "ana@exemplo.com");
        when(usuarioService.criar(any(UsuarioRequest.class))).thenReturn(criado);
        when(jwtService.generateToken(1)).thenReturn("tok");
        when(jwtService.getExpiration()).thenReturn(3600000L);

        AuthResponse response = authService.register(new UsuarioRequest("Ana", "ana@exemplo.com", "senha123"));

        assertThat(response.token()).isEqualTo("tok");
        assertThat(response.tokenType()).isEqualTo("Bearer");
        assertThat(response.expiresIn()).isEqualTo(3600000L);
        assertThat(response.usuario().id()).isEqualTo(1);
    }

    @Test
    void login_comCredenciaisValidas_deveGerarToken() {
        when(authenticationManager.authenticate(any())).thenReturn(mockAuth());
        when(usuarioRepository.findByEmail("ana@exemplo.com"))
                .thenReturn(Optional.of(new Usuario(1, "Ana", "ana@exemplo.com", "hash")));
        when(jwtService.generateToken(1)).thenReturn("tok");
        when(jwtService.getExpiration()).thenReturn(3600000L);

        AuthResponse response = authService.login(new LoginRequest("ana@exemplo.com", "senha123"));

        assertThat(response.token()).isEqualTo("tok");
        assertThat(response.usuario().email()).isEqualTo("ana@exemplo.com");
    }

    @Test
    void login_comCredenciaisInvalidas_devePropagarErroENaoGerarToken() {
        when(authenticationManager.authenticate(any()))
                .thenThrow(new BadCredentialsException("credenciais invalidas"));

        assertThatThrownBy(() -> authService.login(new LoginRequest("ana@exemplo.com", "errada")))
                .isInstanceOf(BadCredentialsException.class);

        verify(jwtService, never()).generateToken(any());
    }

    private Authentication mockAuth() {
        return new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                "ana@exemplo.com", "senha123");
    }
}
