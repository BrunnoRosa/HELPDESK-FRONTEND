package com.example.help_desk.service;

import com.example.help_desk.dto.atendimento.AtendimentoRequestDTO;
import com.example.help_desk.dto.atendimento.AtendimentoResponseDTO;
import com.example.help_desk.model.AtendimentoModel;
import com.example.help_desk.model.ChamadoModel;
import com.example.help_desk.model.UsuarioModel;
import com.example.help_desk.model.enums.NivelSuporte;
import com.example.help_desk.model.enums.PerfilUsuario;
import com.example.help_desk.model.enums.StatusChamado;
import com.example.help_desk.repository.AtendimentoRepository;
import com.example.help_desk.repository.ChamadoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
public class AtendimentoService {

    private static final Map<StatusChamado, Set<StatusChamado>> TRANSICOES = new EnumMap<>(StatusChamado.class);

    static {
        TRANSICOES.put(StatusChamado.ABERTO, Set.of(StatusChamado.EM_TRIAGEM));
        TRANSICOES.put(StatusChamado.EM_TRIAGEM, Set.of(StatusChamado.EM_ATENDIMENTO));
        TRANSICOES.put(StatusChamado.EM_ATENDIMENTO, Set.of(StatusChamado.PENDENTE_EVIDENCIA, StatusChamado.RESOLVIDO));
        TRANSICOES.put(StatusChamado.PENDENTE_EVIDENCIA, Set.of(StatusChamado.EM_ATENDIMENTO, StatusChamado.RESOLVIDO));
        TRANSICOES.put(StatusChamado.RESOLVIDO, Set.of(StatusChamado.FECHADO, StatusChamado.EM_ATENDIMENTO));
        TRANSICOES.put(StatusChamado.FECHADO, Set.of());
    }

    private final AtendimentoRepository atendimentoRepository;
    private final ChamadoRepository chamadoRepository;
    private final UsuarioService usuarioService;
    private final AcessoService acessoService;

    public AtendimentoService(
            AtendimentoRepository atendimentoRepository,
            ChamadoRepository chamadoRepository,
            UsuarioService usuarioService,
            AcessoService acessoService
    ) {
        this.atendimentoRepository = atendimentoRepository;
        this.chamadoRepository = chamadoRepository;
        this.usuarioService = usuarioService;
        this.acessoService = acessoService;
    }

    @Transactional(readOnly = true)
    public List<AtendimentoResponseDTO> listar(UsuarioModel usuario) {
        if (usuario.getPerfil() == PerfilUsuario.USUARIO) {
            return atendimentoRepository.findAllBySolicitanteId(usuario.getId())
                    .stream().map(AtendimentoResponseDTO::new).toList();
        }
        return atendimentoRepository.findAll().stream().map(AtendimentoResponseDTO::new).toList();
    }

    @Transactional(readOnly = true)
    public AtendimentoResponseDTO buscarPorChamado(Long chamadoId, UsuarioModel usuario) {
        acessoService.validarAcessoChamado(usuario, chamadoId);
        AtendimentoModel atendimento = atendimentoRepository.findByChamadoId(chamadoId)
                .orElseThrow(() -> new IllegalArgumentException("Atendimento não localizado ❌"));
        return new AtendimentoResponseDTO(atendimento);
    }

    @Transactional
    public AtendimentoResponseDTO criarInicial(Long chamadoId, UsuarioModel solicitante) {
        ChamadoModel chamado = chamadoRepository.findById(chamadoId)
                .orElseThrow(() -> new IllegalArgumentException("Chamado não localizado ❌"));

        AtendimentoModel existente = atendimentoRepository.findByChamadoId(chamadoId).orElse(null);
        if (existente != null) {
            return new AtendimentoResponseDTO(existente);
        }

        AtendimentoModel atendimento = new AtendimentoModel();
        atendimento.setChamado(chamado);
        atendimento.setSolicitante(solicitante);
        atendimento.setStatus(StatusChamado.ABERTO);
        atendimento.setNivelSuporte(NivelSuporte.N1);
        atendimento.setUsuarioVinculado(solicitante.getNome());

        return new AtendimentoResponseDTO(atendimentoRepository.save(atendimento));
    }

    @Transactional
    public AtendimentoResponseDTO atualizar(AtendimentoRequestDTO dto, UsuarioModel usuarioAtual) {
        AtendimentoModel atendimento = atendimentoRepository.findByChamadoId(dto.getChamadoId())
                .orElseThrow(() -> new IllegalArgumentException("Atendimento não localizado ❌"));

        validarTransicao(atendimento.getStatus(), dto.getStatus());
        validarNivel(dto.getStatus(), dto.getNivelSuporte());

        atendimento.setStatus(dto.getStatus());
        atendimento.setNivelSuporte(dto.getNivelSuporte());
        atendimento.setUsuarioVinculado(dto.getUsuarioVinculado());
        atendimento.setEquipamentoVinculado(dto.getEquipamentoVinculado());

        if (usuarioAtual.getPerfil() == PerfilUsuario.ADMINISTRADOR) {
            if (dto.getTecnicoResponsavelId() == null) {
                atendimento.setTecnicoResponsavel(null);
            } else {
                UsuarioModel tecnico = usuarioService.buscarModelPorId(dto.getTecnicoResponsavelId());
                validarPerfilTecnico(tecnico);
                atendimento.setTecnicoResponsavel(tecnico);
            }
        } else if (usuarioAtual.getPerfil() == PerfilUsuario.TECNICO && atendimento.getTecnicoResponsavel() == null) {
            atendimento.setTecnicoResponsavel(usuarioAtual);
        }

        return new AtendimentoResponseDTO(atendimentoRepository.save(atendimento));
    }

    private void validarPerfilTecnico(UsuarioModel usuario) {
        if (usuario.getPerfil() != PerfilUsuario.TECNICO && usuario.getPerfil() != PerfilUsuario.ADMINISTRADOR) {
            throw new IllegalArgumentException("O responsável precisa possuir perfil TÉCNICO ou ADMINISTRADOR ❌");
        }
    }

    private void validarTransicao(StatusChamado atual, StatusChamado destino) {
        if (atual == destino) {
            return;
        }
        if (!TRANSICOES.getOrDefault(atual, Set.of()).contains(destino)) {
            throw new IllegalArgumentException("Transição de status inválida: " + atual + " -> " + destino);
        }
    }

    private void validarNivel(StatusChamado status, NivelSuporte nivel) {
        if (status == StatusChamado.EM_TRIAGEM && nivel != NivelSuporte.N1) {
            throw new IllegalArgumentException("EM_TRIAGEM deve permanecer no nível N1");
        }
        if (status == StatusChamado.EM_ATENDIMENTO && nivel == NivelSuporte.N1) {
            throw new IllegalArgumentException("EM_ATENDIMENTO deve utilizar N2 ou N3");
        }
    }
}
