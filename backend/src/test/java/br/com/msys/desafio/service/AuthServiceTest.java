package br.com.msys.desafio.service;

import br.com.msys.desafio.dto.AuthResponse;
import br.com.msys.desafio.dto.LoginRequest;
import br.com.msys.desafio.dto.UsuarioRequest;
import br.com.msys.desafio.dto.UsuarioResponse;
import br.com.msys.desafio.exception.UsuarioNaoEncontradoException;
import br.com.msys.desafio.security.JwtService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;

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
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthServiceImpl authService;

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
        when(usuarioService.buscarPorEmail("ana@exemplo.com"))
                .thenReturn(new UsuarioResponse(1, "Ana", "ana@exemplo.com"));
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

    @Test
    void login_usuarioSomeAposAutenticar_deveLancar401ENaoGerarToken() {
        when(authenticationManager.authenticate(any())).thenReturn(mockAuth());
        when(usuarioService.buscarPorEmail("ana@exemplo.com"))
                .thenThrow(new UsuarioNaoEncontradoException("ana@exemplo.com"));

        assertThatThrownBy(() -> authService.login(new LoginRequest("ana@exemplo.com", "senha123")))
                .isInstanceOf(BadCredentialsException.class);

        verify(jwtService, never()).generateToken(any());
    }

    private Authentication mockAuth() {
        return new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                "ana@exemplo.com", "senha123");
    }
}
