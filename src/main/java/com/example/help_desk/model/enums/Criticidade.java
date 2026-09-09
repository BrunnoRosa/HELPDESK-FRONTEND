package com.example.help_desk.model.enums;

public enum Criticidade {
    URGENTE("Urgente"),
    ALTA("Alta"),
    MEDIA("Média"),
    BAIXA("Baixa");

    private String prioridade;

    Criticidade(String prioridade) {
        this.prioridade = prioridade;
    }

    public String getPrioridade() {
        return prioridade;
    }
}
