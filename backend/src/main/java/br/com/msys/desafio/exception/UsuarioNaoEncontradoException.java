package br.com.msys.desafio.exception;

public class UsuarioNaoEncontradoException extends RuntimeException {

    public UsuarioNaoEncontradoException(Integer id) {
        super("Usuario nao encontrado com o id: " + id);
    }

}
