package com.example.help_desk.dto.chamado;

import com.example.help_desk.model.ChamadoModel;
import com.example.help_desk.model.enums.Criticidade;
import com.example.help_desk.model.enums.Ocorrencia;

public class ChamadoResponseDTO {
    private Long id;
    private String tituloChamado;
    private Ocorrencia ocorrenciaChamado;
    private String descricaoChamado;
    private Criticidade prioridadeChamado;

    public ChamadoResponseDTO() {
    }

    public ChamadoResponseDTO(Long id, String tituloChamado, Ocorrencia ocorrenciaChamado, String descricaoChamado,
                              Criticidade prioridadeChamado) {
        this.id = id;
        this.tituloChamado = tituloChamado;
        this.ocorrenciaChamado = ocorrenciaChamado;
        this.descricaoChamado = descricaoChamado;
        this.prioridadeChamado = prioridadeChamado;
    }

    public ChamadoResponseDTO(ChamadoModel chamado) {
        this.id = chamado.getId();
        this.tituloChamado = chamado.getTituloChamado();
        this.ocorrenciaChamado = chamado.getOcorrenciaChamado();
        this.descricaoChamado = chamado.getDescricaoChamado();
        this.prioridadeChamado = chamado.getPrioridadeChamado();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTituloChamado() {
        return tituloChamado;
    }

    public void setTituloChamado(String tituloChamado) {
        this.tituloChamado = tituloChamado;
    }

    public Ocorrencia getOcorrenciaChamado() {
        return ocorrenciaChamado;
    }

    public void setOcorrenciaChamado(Ocorrencia ocorrenciaChamado) {
        this.ocorrenciaChamado = ocorrenciaChamado;
    }

    public String getDescricaoChamado() {
        return descricaoChamado;
    }

    public void setDescricaoChamado(String descricaoChamado) {
        this.descricaoChamado = descricaoChamado;
    }

    public Criticidade getPrioridadeChamado() {
        return prioridadeChamado;
    }

    public void setPrioridadeChamado(Criticidade prioridadeChamado) {
        this.prioridadeChamado = prioridadeChamado;
    }
}

