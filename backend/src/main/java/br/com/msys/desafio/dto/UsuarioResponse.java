package br.com.msys.desafio.dto;

/**
 * Resposta publica de usuario. Nunca inclui a senha.
 */
public record UsuarioResponse(Integer id, String nome, String email) {
}
