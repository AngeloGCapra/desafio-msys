package br.com.msys.desafio.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(

        @NotBlank(message = "O e-mail e obrigatorio")
        @Email(message = "O e-mail deve ter um formato valido")
        String email,

        @NotBlank(message = "A senha e obrigatoria")
        String senha
) {
}
