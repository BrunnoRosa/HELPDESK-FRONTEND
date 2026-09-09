package com.example.help_desk.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class LoginRequestDTO {

    @NotBlank(message = "E-mail é obrigatório ❌")
    @Email(message = "Informe um e-mail válido ❌")
    private String email;

    @NotBlank(message = "Senha é obrigatória ❌")
    private String senha;

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
}
