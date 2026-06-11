package br.com.msys.desafio.security;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class JwtServiceTest {

    private static final String SECRET = "uma-chave-de-teste-bem-grande-para-hmac-sha-0123456789";

    @Test
    void gerarEExtrair_deveFazerRoundTripDoId() {
        JwtService jwtService = new JwtService(SECRET, 3_600_000L);

        String token = jwtService.generateToken(5);

        assertThat(jwtService.extractUserId(token)).isEqualTo(5);
        assertThat(jwtService.isValid(token)).isTrue();
    }

    @Test
    void isValid_comTokenAdulterado_deveSerFalso() {
        JwtService jwtService = new JwtService(SECRET, 3_600_000L);

        assertThat(jwtService.isValid("abc.def.ghi")).isFalse();
    }

    @Test
    void isValid_comTokenExpirado_deveSerFalso() {
        JwtService jwtService = new JwtService(SECRET, -1_000L);

        String tokenExpirado = jwtService.generateToken(5);

        assertThat(jwtService.isValid(tokenExpirado)).isFalse();
    }
}
