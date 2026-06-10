package br.com.msys.desafio.security;

import br.com.msys.desafio.entity.Usuario;
import br.com.msys.desafio.repository.UsuarioRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UsuarioRepository repository;

    public CustomUserDetailsService(UsuarioRepository repository) {
        this.repository = repository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return repository.findByEmail(email)
                .map(this::toUserDetails)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario nao encontrado: " + email));
    }

    public UserDetails loadUserById(Integer id) throws UsernameNotFoundException {
        return repository.findById(id)
                .map(this::toUserDetails)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario nao encontrado: id " + id));
    }

    private UserDetails toUserDetails(Usuario usuario) {
        return User.withUsername(usuario.getEmail())
                .password(usuario.getSenha())
                .authorities("ROLE_USER")
                .build();
    }
}
