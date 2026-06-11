package br.com.msys.desafio.exception;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.OffsetDateTime;
import java.util.Map;

/**
 * Corpo padronizado de erro da API. O campo "fields" so aparece em erros de validação.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record ApiError(OffsetDateTime timestamp, int status, String error, String message, String path, Map<String, String> fields) {

    public static ApiError of(int status, String error, String message, String path) {
        return new ApiError(OffsetDateTime.now(), status, error, message, path, null);
    }

    public static ApiError validation(int status, String error, String message, String path, Map<String, String> fields) {
        return new ApiError(OffsetDateTime.now(), status, error, message, path, fields);
    }

}
