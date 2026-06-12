package br.com.msys.desafio.service;

import br.com.msys.desafio.dto.AuthResponse;
import br.com.msys.desafio.dto.LoginRequest;
import br.com.msys.desafio.dto.UsuarioRequest;

public interface AuthService {

    AuthResponse register(UsuarioRequest request);

    AuthResponse login(LoginRequest request);

}
