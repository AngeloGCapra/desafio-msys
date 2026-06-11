package br.com.msys.desafio.dto;

import br.com.msys.desafio.entity.Usuario;

/**
 * Resposta publica de usuario. Nunca inclui a senha.
 */
public record UsuarioResponse(Integer id, String nome, String email) {

    public static UsuarioResponse from(Usuario usuario) {
        return new UsuarioResponse(usuario.getId(), usuario.getNome(), usuario.getEmail());
    }

}
