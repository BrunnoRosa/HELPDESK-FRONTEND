package com.example.help_desk.dto.usuario;

import com.example.help_desk.model.enums.PerfilUsuario;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class UsuarioRequestDTO {

    @NotBlank(message = "Nome é obrigatório ❌")
    private String nome;

    @NotBlank(message = "E-mail é obrigatório ❌")
    @Email(message = "Informe um e-mail válido ❌")
    private String email;

    @NotBlank(message = "Senha é obrigatória ❌")
    @Size(min = 6, message = "A senha deve possuir no mínimo 6 caracteres ❌")
    private String senha;

    @NotNull(message = "Perfil de acesso é obrigatório ❌")
    private PerfilUsuario perfil;

    public UsuarioRequestDTO() {
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public PerfilUsuario getPerfil() {
        return perfil;
    }

    public void setPerfil(PerfilUsuario perfil) {
        this.perfil = perfil;
    }
}
