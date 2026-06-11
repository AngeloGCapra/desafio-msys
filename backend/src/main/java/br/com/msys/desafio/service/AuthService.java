package br.com.msys.desafio.service;

import br.com.msys.desafio.dto.AuthResponse;
import br.com.msys.desafio.dto.LoginRequest;
import br.com.msys.desafio.dto.UsuarioRequest;
import br.com.msys.desafio.dto.UsuarioResponse;
import br.com.msys.desafio.repository.UsuarioRepository;
import br.com.msys.desafio.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UsuarioService usuarioService;
    private final UsuarioRepository usuarioRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(UsuarioService usuarioService, UsuarioRepository usuarioRepository,
                       AuthenticationManager authenticationManager, JwtService jwtService) {
        this.usuarioService = usuarioService;
        this.usuarioRepository = usuarioRepository;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    public AuthResponse register(UsuarioRequest request) {
        UsuarioResponse usuario = usuarioService.criar(request);
        String token = jwtService.generateToken(usuario.id());
        return AuthResponse.of(token, jwtService.getExpiration(), usuario);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.senha()));
        UsuarioResponse usuario = usuarioRepository.findByEmail(request.email())
                .map(UsuarioResponse::from)
                .orElseThrow(() -> new BadCredentialsException("Credenciais invalidas"));
        String token = jwtService.generateToken(usuario.id());
        return AuthResponse.of(token, jwtService.getExpiration(), usuario);
    }
}
