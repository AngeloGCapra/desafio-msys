package br.com.msys.desafio.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UsuarioRequest(

        @NotBlank(message = "O nome e obrigatorio")
        @Size(max = 255, message = "O nome deve ter no maximo 255 caracteres")
        String nome,

        @NotBlank(message = "O e-mail e obrigatorio")
        @Email(message = "O e-mail deve ter um formato valido")
        @Size(max = 100, message = "O e-mail deve ter no maximo 100 caracteres")
        String email,

        @NotBlank(message = "A senha e obrigatoria")
        @Size(min = 6, max = 72, message = "A senha deve ter entre 6 e 72 caracteres")
        String senha
) {
}
