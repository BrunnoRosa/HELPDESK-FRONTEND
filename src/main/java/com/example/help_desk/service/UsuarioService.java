package com.example.help_desk.service;

import com.example.help_desk.dto.usuario.PerfilUpdateDTO;
import com.example.help_desk.dto.usuario.UsuarioResponseDTO;
import com.example.help_desk.model.UsuarioModel;
import com.example.help_desk.model.enums.PerfilUsuario;
import com.example.help_desk.repository.AtendimentoRepository;
import com.example.help_desk.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UsuarioService implements UserDetailsService {

    @Autowired
    private final UsuarioRepository usuarioRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final AtendimentoRepository atendimentoRepository;

    public UsuarioService(
            UsuarioRepository usuarioRepository,
            BCryptPasswordEncoder passwordEncoder,
            AtendimentoRepository atendimentoRepository
    ) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.atendimentoRepository = atendimentoRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return usuarioRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado: " + email));
    }

    public UsuarioModel buscarPorEmail(String email) {
        return usuarioRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não localizado ❌"));
    }

    public UsuarioModel buscarModelPorId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não localizado ❌"));
    }

    @Transactional
    public UsuarioResponseDTO cadastrar(@org.jetbrains.annotations.UnknownNullability UsuarioResponseDTO dto) {
        if (usuarioRepository.existsByEmailIgnoreCase(dto.getEmail())) {
            throw new IllegalArgumentException("E-mail já cadastrado ❌");
        }

        UsuarioModel usuario = new UsuarioModel();
        usuario.setNome(dto.getNome().trim());
        usuario.setEmail(dto.getEmail().trim().toLowerCase());
        usuario.setSenha(passwordEncoder.encode(dto.getSenha()));
        usuario.setPerfil(dto.getPerfil());

        return new UsuarioResponseDTO(usuarioRepository.save(usuario));
    }

    public List<UsuarioResponseDTO> listar() {
        return usuarioRepository.findAll().stream().map(UsuarioResponseDTO::new).toList();
    }

    public List<UsuarioResponseDTO> listarTecnicos() {
        return usuarioRepository.findAllByPerfil(PerfilUsuario.TECNICO)
                .stream().map(UsuarioResponseDTO::new).toList();
    }

    @Transactional
    public UsuarioResponseDTO atualizarPerfil(Long id, PerfilUpdateDTO dto) {
        UsuarioModel usuario = buscarModelPorId(id);
        usuario.setPerfil(dto.getPerfil());
        return new UsuarioResponseDTO(usuarioRepository.save(usuario));
    }

    @Transactional
    public void deletar(Long id, Long usuarioAtualId) {
        if (id.equals(usuarioAtualId)) {
            throw new IllegalArgumentException("O administrador não pode excluir a própria conta autenticada ❌");
        }
        if (!usuarioRepository.existsById(id)) {
            throw new IllegalArgumentException("Usuário não localizado ❌");
        }
        if (atendimentoRepository.countBySolicitanteId(id) > 0 || atendimentoRepository.countByTecnicoResponsavelId(id) > 0) {
            throw new IllegalArgumentException("Usuário possui chamados vinculados e não pode ser excluído ❌");
        }
        usuarioRepository.deleteById(id);
    }
}
