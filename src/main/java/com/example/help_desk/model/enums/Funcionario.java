package com.example.help_desk.model.enums;

public enum Funcionario {
        JUNIOR ("Técnico Junior"),
        SENIOR ("Técnico Sênior"),
        PLENO ("Técnico Pleno");

        private String tecnico;

    Funcionario(String tecnico) {
        this.tecnico = tecnico;
    }

    public String getTecnico() {
        return tecnico;
    }
}
