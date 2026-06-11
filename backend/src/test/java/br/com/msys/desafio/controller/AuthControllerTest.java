package br.com.msys.desafio.controller;

import br.com.msys.desafio.config.CorsConfig;
import br.com.msys.desafio.config.SecurityConfig;
import br.com.msys.desafio.dto.AuthResponse;
import br.com.msys.desafio.dto.LoginRequest;
import br.com.msys.desafio.dto.UsuarioRequest;
import br.com.msys.desafio.dto.UsuarioResponse;
import br.com.msys.desafio.security.CustomUserDetailsService;
import br.com.msys.desafio.security.JwtAuthenticationEntryPoint;
import br.com.msys.desafio.security.JwtAuthenticationFilter;
import br.com.msys.desafio.security.JwtService;
import br.com.msys.desafio.service.AuthService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
@Import({SecurityConfig.class, CorsConfig.class, JwtAuthenticationFilter.class, JwtAuthenticationEntryPoint.class})
class AuthControllerTest {

    @Autowired
    private MockMvc mvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private AuthService authService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private CustomUserDetailsService userDetailsService;

    @MockitoBean
    private PasswordEncoder passwordEncoder;

    @Test
    void register_valido_deveRetornar201ComToken() throws Exception {
        AuthResponse resp = new AuthResponse("tok", "Bearer", 3600000L,
                new UsuarioResponse(1, "Ana", "ana@exemplo.com"));
        when(authService.register(any())).thenReturn(resp);

        UsuarioRequest req = new UsuarioRequest("Ana", "ana@exemplo.com", "senha123");

        mvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").value("tok"))
                .andExpect(jsonPath("$.usuario.email").value("ana@exemplo.com"));
    }

    @Test
    void register_invalido_deveRetornar400() throws Exception {
        UsuarioRequest req = new UsuarioRequest("", "nao-eh-email", "123");

        mvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void login_valido_deveRetornar200() throws Exception {
        AuthResponse resp = new AuthResponse("tok", "Bearer", 3600000L,
                new UsuarioResponse(1, "Ana", "ana@exemplo.com"));
        when(authService.login(any())).thenReturn(resp);

        LoginRequest req = new LoginRequest("ana@exemplo.com", "senha123");

        mvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("tok"));
    }
}
