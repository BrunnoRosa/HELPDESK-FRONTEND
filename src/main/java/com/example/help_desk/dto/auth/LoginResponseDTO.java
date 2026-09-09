package com.example.help_desk.dto.auth;

import com.example.help_desk.model.UsuarioModel;
import com.example.help_desk.model.enums.PerfilUsuario;

public class LoginResponseDTO {

    private final String token;
    private final Long id;
    private final String nome;
    private final String email;
    private final PerfilUsuario perfil;

    public LoginResponseDTO(String token, UsuarioModel usuario) {
        this.token = token;
        this.id = usuario.getId();
        this.nome = usuario.getNome();
        this.email = usuario.getEmail();
        this.perfil = usuario.getPerfil();
    }

    public String getToken() {
        return token;
    }

    public Long getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public String getEmail() {
        return email;
    }

    public PerfilUsuario getPerfil() {
        return perfil;
    }
}
