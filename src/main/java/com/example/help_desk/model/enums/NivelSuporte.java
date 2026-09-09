package com.example.help_desk.model.enums;

public enum NivelSuporte {
    N1("Triagem"),
    N2("Especializado"),
    N3("Sênior");

    private final String descricao;

    NivelSuporte(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }
}
