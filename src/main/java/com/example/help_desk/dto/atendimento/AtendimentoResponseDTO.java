package com.example.help_desk.dto.atendimento;

import com.example.help_desk.model.AtendimentoModel;
import com.example.help_desk.model.enums.NivelSuporte;
import com.example.help_desk.model.enums.StatusChamado;

public class AtendimentoResponseDTO {

    private Long id;
    private Long chamadoId;
    private StatusChamado status;
    private NivelSuporte nivelSuporte;
    private String usuarioVinculado;
    private String equipamentoVinculado;
    private Long solicitanteId;
    private String solicitanteNome;
    private Long tecnicoResponsavelId;
    private String tecnicoResponsavelNome;

    public AtendimentoResponseDTO() {
    }

    public AtendimentoResponseDTO(Long id, Long chamadoId, StatusChamado status, NivelSuporte nivelSuporte,
                                  String usuarioVinculado, String equipamentoVinculado, Long solicitanteId,
                                  String solicitanteNome, Long tecnicoResponsavelId, String tecnicoResponsavelNome) {
        this.id = id;
        this.chamadoId = chamadoId;
        this.status = status;
        this.nivelSuporte = nivelSuporte;
        this.usuarioVinculado = usuarioVinculado;
        this.equipamentoVinculado = equipamentoVinculado;
        this.solicitanteId = solicitanteId;
        this.solicitanteNome = solicitanteNome;
        this.tecnicoResponsavelId = tecnicoResponsavelId;
        this.tecnicoResponsavelNome = tecnicoResponsavelNome;
    }

    // CONSTRUTOR NECESSÁRIO PARA O METHOD REFERENCE (AtendimentoResponseDTO::new)
    public AtendimentoResponseDTO(AtendimentoModel model) {
        if (model != null) {
            this.id = model.getId();
            this.status = model.getStatus();
            this.nivelSuporte = model.getNivelSuporte();
            this.usuarioVinculado = model.getUsuarioVinculado();
            this.equipamentoVinculado = model.getEquipamentoVinculado();

            if (model.getChamado() != null) {
                this.chamadoId = model.getChamado().getId();
            }

            if (model.getSolicitante() != null) {
                this.solicitanteId = model.getSolicitante().getId();
                this.solicitanteNome = model.getSolicitante().getNome();
            }

            if (model.getTecnicoResponsavel() != null) {
                this.tecnicoResponsavelId = model.getTecnicoResponsavel().getId();
                this.tecnicoResponsavelNome = model.getTecnicoResponsavel().getNome();
            }
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getChamadoId() {
        return chamadoId;
    }

    public void setChamadoId(Long chamadoId) {
        this.chamadoId = chamadoId;
    }

    public StatusChamado getStatus() {
        return status;
    }

    public void setStatus(StatusChamado status) {
        this.status = status;
    }

    public NivelSuporte getNivelSuporte() {
        return nivelSuporte;
    }

    public void setNivelSuporte(NivelSuporte nivelSuporte) {
        this.nivelSuporte = nivelSuporte;
    }

    public String getUsuarioVinculado() {
        return usuarioVinculado;
    }

    public void setUsuarioVinculado(String usuarioVinculado) {
        this.usuarioVinculado = usuarioVinculado;
    }

    public String getEquipamentoVinculado() {
        return equipamentoVinculado;
    }

    public void setEquipamentoVinculado(String equipamentoVinculado) {
        this.equipamentoVinculado = equipamentoVinculado;
    }

    public Long getSolicitanteId() {
        return solicitanteId;
    }

    public void setSolicitanteId(Long solicitanteId) {
        this.solicitanteId = solicitanteId;
    }

    public String getSolicitanteNome() {
        return solicitanteNome;
    }

    public void setSolicitanteNome(String solicitanteNome) {
        this.solicitanteNome = solicitanteNome;
    }

    public Long getTecnicoResponsavelId() {
        return tecnicoResponsavelId;
    }

    public void setTecnicoResponsavelId(Long tecnicoResponsavelId) {
        this.tecnicoResponsavelId = tecnicoResponsavelId;
    }

    public String getTecnicoResponsavelNome() {
        return tecnicoResponsavelNome;
    }

    public void setTecnicoResponsavelNome(String tecnicoResponsavelNome) {
        this.tecnicoResponsavelNome = tecnicoResponsavelNome;
    }
}