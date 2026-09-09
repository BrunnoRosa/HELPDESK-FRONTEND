package com.example.help_desk.model;


import com.example.help_desk.model.enums.NivelSuporte;
import com.example.help_desk.model.enums.StatusChamado;
import jakarta.persistence.*;

@Entity
@Table(name = "tab_clientes")
public class AtendimentoModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "chamado_id", nullable = false, unique = true)
    private ChamadoModel chamado;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "solicitante_id", nullable = false)
    private UsuarioModel solicitante;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tecnico_responsavel_id")
    private UsuarioModel tecnicoResponsavel;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusChamado status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NivelSuporte nivelSuporte;

    @Column
    private String usuarioVinculado;

    @Column
    private String equipamentoVinculado;

    public AtendimentoModel() {
    }

    public AtendimentoModel(Long id, ChamadoModel chamado, UsuarioModel solicitante, UsuarioModel tecnicoResponsavel, StatusChamado status, NivelSuporte nivelSuporte, String usuarioVinculado, String equipamentoVinculado) {
        this.id = id;
        this.chamado = chamado;
        this.solicitante = solicitante;
        this.tecnicoResponsavel = tecnicoResponsavel;
        this.status = status;
        this.nivelSuporte = nivelSuporte;
        this.usuarioVinculado = usuarioVinculado;
        this.equipamentoVinculado = equipamentoVinculado;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ChamadoModel getChamado() {
        return chamado;
    }

    public void setChamado(ChamadoModel chamado) {
        this.chamado = chamado;
    }

    public UsuarioModel getSolicitante() {
        return solicitante;
    }

    public void setSolicitante(UsuarioModel solicitante) {
        this.solicitante = solicitante;
    }

    public UsuarioModel getTecnicoResponsavel() {
        return tecnicoResponsavel;
    }

    public void setTecnicoResponsavel(UsuarioModel tecnicoResponsavel) {
        this.tecnicoResponsavel = tecnicoResponsavel;
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
}
