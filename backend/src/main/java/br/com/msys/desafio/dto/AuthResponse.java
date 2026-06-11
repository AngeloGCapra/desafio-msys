package br.com.msys.desafio.dto;

/**
 * Resposta de autenticacao: token JWT + dados publicos do usuario.
 */
public record AuthResponse(
        String token,
        String tokenType,
        long expiresIn,
        UsuarioResponse usuario
) {
    public static AuthResponse of(String token, long expiresIn, UsuarioResponse usuario) {
        return new AuthResponse(token, "Bearer", expiresIn, usuario);
    }
}
