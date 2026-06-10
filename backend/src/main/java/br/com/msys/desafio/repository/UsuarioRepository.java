package br.com.msys.desafio.repository;

import br.com.msys.desafio.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

    boolean existsByEmail(String email);

    boolean existsByEmailAndIdNot(String email, Integer id);

    Optional<Usuario> findByEmail(String email);

}
