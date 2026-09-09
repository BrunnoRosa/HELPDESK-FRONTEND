package com.example.help_desk.service;

import com.example.help_desk.model.AtendimentoModel;
import com.example.help_desk.model.UsuarioModel;
import com.example.help_desk.model.enums.PerfilUsuario;
import com.example.help_desk.repository.AtendimentoRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

@Service
public class AcessoService {

    private final AtendimentoRepository atendimentoRepository;

    public AcessoService(AtendimentoRepository atendimentoRepository) {
        this.atendimentoRepository = atendimentoRepository;
    }

    public boolean acessoGlobal(UsuarioModel usuario) {
        return usuario.getPerfil() == PerfilUsuario.TECNICO
                || usuario.getPerfil() == PerfilUsuario.ADMINISTRADOR;
    }

    public void validarAcessoChamado(UsuarioModel usuario, Long chamadoId) {
        if (acessoGlobal(usuario)) {
            return;
        }

        AtendimentoModel atendimento = atendimentoRepository.findByChamadoId(chamadoId)
                .orElseThrow(() -> new IllegalArgumentException("Atendimento não localizado ❌"));

        if (!atendimento.getSolicitante().getId().equals(usuario.getId())) {
            throw new AccessDeniedException("Você só pode acessar seus próprios chamados ❌");
        }
    }
}
