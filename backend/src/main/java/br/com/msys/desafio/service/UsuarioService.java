package br.com.msys.desafio.service;

import br.com.msys.desafio.dto.UsuarioRequest;
import br.com.msys.desafio.dto.UsuarioResponse;
import br.com.msys.desafio.dto.UsuarioUpdateRequest;

import java.util.List;

public interface UsuarioService {

    List<UsuarioResponse> listar();

    UsuarioResponse buscarPorId(Integer id);

    UsuarioResponse buscarPorEmail(String email);

    UsuarioResponse criar(UsuarioRequest request);

    UsuarioResponse atualizar(Integer id, UsuarioUpdateRequest request);

    void excluir(Integer id);

}
