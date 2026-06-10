package br.com.msys.desafio.exception;

public class EmailJaCadastradoException extends RuntimeException {

    public EmailJaCadastradoException(String email) {
        super("Ja existe um usuario cadastrado com o e-mail: " + email);
    }

}
