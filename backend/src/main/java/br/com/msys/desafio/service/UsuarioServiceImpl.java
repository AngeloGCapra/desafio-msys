package br.com.msys.desafio.service;

import br.com.msys.desafio.dto.UsuarioRequest;
import br.com.msys.desafio.dto.UsuarioResponse;
import br.com.msys.desafio.dto.UsuarioUpdateRequest;
import br.com.msys.desafio.entity.Usuario;
import br.com.msys.desafio.exception.EmailJaCadastradoException;
import br.com.msys.desafio.exception.UsuarioNaoEncontradoException;
import br.com.msys.desafio.mapper.UsuarioMapper;
import br.com.msys.desafio.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final UsuarioMapper mapper;

    public UsuarioServiceImpl(UsuarioRepository repository, PasswordEncoder passwordEncoder,
                              UsuarioMapper mapper) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.mapper = mapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<UsuarioResponse> listar() {
        return repository.findAll().stream().map(mapper::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public UsuarioResponse buscarPorId(Integer id) {
        return mapper.toResponse(buscarEntidade(id));
    }

    @Override
    @Transactional(readOnly = true)
    public UsuarioResponse buscarPorEmail(String email) {
        return repository.findByEmail(email)
                .map(mapper::toResponse)
                .orElseThrow(() -> new UsuarioNaoEncontradoException(email));
    }

    @Override
    @Transactional
    public UsuarioResponse criar(UsuarioRequest request) {
        if (repository.existsByEmail(request.email())) {
            throw new EmailJaCadastradoException(request.email());
        }
        Usuario usuario = mapper.toEntity(request, passwordEncoder.encode(request.senha()));
        return mapper.toResponse(repository.save(usuario));
    }

    @Override
    @Transactional
    public UsuarioResponse atualizar(Integer id, UsuarioUpdateRequest request) {
        Usuario usuario = buscarEntidade(id);
        if (repository.existsByEmailAndIdNot(request.email(), id)) {
            throw new EmailJaCadastradoException(request.email());
        }
        usuario.atualizarDados(request.nome(), request.email());
        if (request.senha() != null) {
            usuario.trocarSenha(passwordEncoder.encode(request.senha()));
        }
        return mapper.toResponse(repository.save(usuario));
    }

    @Override
    @Transactional
    public void excluir(Integer id) {
        Usuario usuario = buscarEntidade(id);
        repository.delete(usuario);
    }

    private Usuario buscarEntidade(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new UsuarioNaoEncontradoException(id));
    }

}
