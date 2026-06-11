package br.com.msys.desafio.controller;

import br.com.msys.desafio.config.CorsConfig;
import br.com.msys.desafio.config.SecurityConfig;
import br.com.msys.desafio.dto.UsuarioResponse;
import br.com.msys.desafio.dto.UsuarioUpdateRequest;
import br.com.msys.desafio.security.CustomUserDetailsService;
import br.com.msys.desafio.security.JwtAuthenticationEntryPoint;
import br.com.msys.desafio.security.JwtAuthenticationFilter;
import br.com.msys.desafio.security.JwtService;
import br.com.msys.desafio.service.UsuarioService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UsuarioController.class)
@Import({SecurityConfig.class, CorsConfig.class, JwtAuthenticationFilter.class, JwtAuthenticationEntryPoint.class})
class UsuarioControllerTest {

    @Autowired
    private MockMvc mvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private UsuarioService usuarioService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private CustomUserDetailsService userDetailsService;

    @MockitoBean
    private PasswordEncoder passwordEncoder;

    @Test
    void getSemToken_deveRetornar401() throws Exception {
        mvc.perform(get("/api/usuarios"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser
    void getAutenticado_deveRetornar200() throws Exception {
        when(usuarioService.listar()).thenReturn(List.of(new UsuarioResponse(1, "Ana", "ana@exemplo.com")));

        mvc.perform(get("/api/usuarios"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].email").value("ana@exemplo.com"));
    }

    @Test
    @WithMockUser
    void putComCorpoInvalido_deveRetornar400() throws Exception {
        UsuarioUpdateRequest invalido = new UsuarioUpdateRequest("", "nao-eh-email", null);

        mvc.perform(put("/api/usuarios/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalido)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser
    void deleteAutenticado_deveRetornar204() throws Exception {
        mvc.perform(delete("/api/usuarios/1"))
                .andExpect(status().isNoContent());
    }
}
