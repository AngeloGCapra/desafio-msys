package br.com.msys.desafio.service;

import br.com.msys.desafio.dto.AuthResponse;
import br.com.msys.desafio.dto.LoginRequest;
import br.com.msys.desafio.dto.UsuarioRequest;
import br.com.msys.desafio.dto.UsuarioResponse;
import br.com.msys.desafio.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final UsuarioService usuarioService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthServiceImpl(UsuarioService usuarioService, AuthenticationManager authenticationManager,
                           JwtService jwtService) {
        this.usuarioService = usuarioService;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @Override
    public AuthResponse register(UsuarioRequest request) {
        UsuarioResponse usuario = usuarioService.criar(request);
        String token = jwtService.generateToken(usuario.id());
        return AuthResponse.of(token, jwtService.getExpiration(), usuario);
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.senha()));
        UsuarioResponse usuario = usuarioService.buscarPorEmail(request.email());
        String token = jwtService.generateToken(usuario.id());
        return AuthResponse.of(token, jwtService.getExpiration(), usuario);
    }
}
