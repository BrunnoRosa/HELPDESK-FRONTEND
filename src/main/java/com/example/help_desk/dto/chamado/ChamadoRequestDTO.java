package com.example.help_desk.dto.chamado;

import com.example.help_desk.model.enums.Criticidade;
import com.example.help_desk.model.enums.Ocorrencia;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ChamadoRequestDTO {

    private Long id;

    @NotBlank(message = "Título de Obrigatório ❌")
    private String tituloChamado;

    @NotNull(message = "Defina uma Opção 🔎")
    private Ocorrencia ocorrenciaChamado;

    @NotBlank(message = "Descreva a Falha 📝")
    private String descricaoChamado;

    @NotNull(message = "Escolha a Prioridade 🔎")
    private Criticidade prioridadeChamado;

    public ChamadoRequestDTO() {
    }

    public ChamadoRequestDTO(Long id, String tituloChamado, Ocorrencia ocorrenciaChamado, String descricaoChamado, Criticidade prioridadeChamado) {
        this.id = id;
        this.tituloChamado = tituloChamado;
        this.ocorrenciaChamado = ocorrenciaChamado;
        this.descricaoChamado = descricaoChamado;
        this.prioridadeChamado = prioridadeChamado;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public @NotBlank(message = "Título de Obrigatório ❌") String getTituloChamado() {
        return tituloChamado;
    }

    public void setTituloChamado(@NotBlank(message = "Título de Obrigatório ❌") String tituloChamado) {
        this.tituloChamado = tituloChamado;
    }

    public @NotNull(message = "Defina uma Opção 🔎") Ocorrencia getOcorrenciaChamado() {
        return ocorrenciaChamado;
    }

    public void setOcorrenciaChamado(@NotNull(message = "Defina uma Opção 🔎") Ocorrencia ocorrenciaChamado) {
        this.ocorrenciaChamado = ocorrenciaChamado;
    }

    public @NotBlank(message = "Descreva a Falha 📝") String getDescricaoChamado() {
        return descricaoChamado;
    }

    public void setDescricaoChamado(@NotBlank(message = "Descreva a Falha 📝") String descricaoChamado) {
        this.descricaoChamado = descricaoChamado;
    }

    public @NotNull(message = "Escolha a Prioridade 🔎") Criticidade getPrioridadeChamado() {
        return prioridadeChamado;
    }

    public void setPrioridadeChamado(@NotNull(message = "Escolha a Prioridade 🔎") Criticidade prioridadeChamado) {
        this.prioridadeChamado = prioridadeChamado;
    }
}
