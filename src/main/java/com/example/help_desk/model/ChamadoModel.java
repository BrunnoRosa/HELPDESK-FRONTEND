package com.example.help_desk.model;


import com.example.help_desk.model.enums.Criticidade;
import com.example.help_desk.model.enums.Ocorrencia;
import jakarta.persistence.*;

@Entity
@Table(name = "tab_chamados")
public class ChamadoModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String tituloChamado;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Ocorrencia ocorrenciaChamado;

    @Column(nullable = false)
    private String descricaoChamado;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Criticidade prioridadeChamado;

    public ChamadoModel() {
    }

    public ChamadoModel(Long id, String tituloChamado, Ocorrencia ocorrenciaChamado, String descricaoChamado, Criticidade prioridadeChamado) {
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


