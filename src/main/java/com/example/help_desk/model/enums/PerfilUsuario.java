package com.example.help_desk.model.enums;

public enum PerfilUsuario {

    USUARIO("Cliente/Solicitante"),
    TECNICO("Atendente/Suporte"),
    ADMINISTRADOR("Gestão Global");

    private final String descricao;

    PerfilUsuario(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }
}
