package com.example.help_desk.repository;

import com.example.help_desk.model.UsuarioModel;
import com.example.help_desk.model.enums.PerfilUsuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<UsuarioModel, Long> {

    // Método usado pelo UsuarioService para login/busca case-insensitive
    Optional<UsuarioModel> findByEmailIgnoreCase(String email);

    // Verificação de e-mail duplicado
    boolean existsByEmailIgnoreCase(String email);

    // Listagem por perfil (ex: buscar técnicos)
    List<UsuarioModel> findAllByPerfil(PerfilUsuario perfil);

    // Verificação do Admin no AdminInitializerConfig
    boolean existsByPerfil(PerfilUsuario perfil);
}