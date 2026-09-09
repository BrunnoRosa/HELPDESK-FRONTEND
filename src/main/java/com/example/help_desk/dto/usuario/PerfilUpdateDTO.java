package com.example.help_desk.dto.usuario;

import com.example.help_desk.model.enums.PerfilUsuario;
import jakarta.validation.constraints.NotNull;

public class PerfilUpdateDTO {

    @NotNull(message = "Perfil de acesso é obrigatório ❌")
    private PerfilUsuario perfil;

    public PerfilUsuario getPerfil() {
        return perfil;
    }

    public void setPerfil(PerfilUsuario perfil) {
        this.perfil = perfil;
    }
}
