package br.com.msys.desafio.mapper;

import br.com.msys.desafio.dto.UsuarioRequest;
import br.com.msys.desafio.dto.UsuarioResponse;
import br.com.msys.desafio.entity.Usuario;
import org.springframework.stereotype.Component;

/**
 * Isola a conversao entre a entidade Usuario e os DTOs. A senha (hash) e
 * fornecida pelo service; o mapper nunca a expoe em respostas.
 */
@Component
public class UsuarioMapper {

    public Usuario toEntity(UsuarioRequest request, String senhaHash) {
        return Usuario.builder()
                .nome(request.nome())
                .email(request.email())
                .senha(senhaHash)
                .build();
    }

    public UsuarioResponse toResponse(Usuario usuario) {
        return new UsuarioResponse(usuario.getId(), usuario.getNome(), usuario.getEmail());
    }

}
