package com.example.help_desk.dto.usuario;

import com.example.help_desk.model.UsuarioModel;
import com.example.help_desk.model.enums.PerfilUsuario;

/**
 * Objeto de Transferência de Dados (DTO) para resposta de Usuário.
 * Utilizado para expor apenas os dados necessários na API, garantindo segurança
 * ao omitir informações sensíveis (como a senha) do modelo de domínio.
 */
public class UsuarioResponseDTO {

    // Identificador único do usuário
    private Long id;

    // Nome completo do usuário
    private String nome;

    // Endereço de e-mail do usuário
    private String email;

    // Nível de acesso ou permissão do usuário no sistema (ex: ADMIN, CLIENTE, TECNICO)
    private PerfilUsuario perfil;

    /**
     * Construtor padrão sem argumentos.
     * Necessário para frameworks de serialização/deserialização (ex: Jackson no Spring Boot).
     */
    public UsuarioResponseDTO() {
    }

    /**
     * Construtor de conveniência que mapeia uma entidade de domínio (UsuarioModel)
     * para esta classe DTO.
     *
     * @param usuario Instância do modelo de entidade UsuarioModel contendo os dados de origem.
     */
    public UsuarioResponseDTO(UsuarioModel usuario) {
        this.id = usuario.getId();
        this.nome = usuario.getNome();
        this.email = usuario.getEmail();
        this.perfil = usuario.getPerfil();
    }

    // --- Métodos Getters ---

    /**
     * Obtém o ID do usuário.
     * @return ID do usuário.
     */
    public Long getId() {
        return id;
    }

    /**
     * Obtém o nome do usuário.
     * @return Nome do usuário.
     */
    public String getNome() {
        return nome;
    }

    /**
     * Obtém o e-mail do usuário.
     * @return E-mail do usuário.
     */
    public String getEmail() {
        return email;
    }

    /**
     * Obtém o perfil de acesso do usuário.
     * @return Enum PerfilUsuario representando a permissão.
     */
    public PerfilUsuario getPerfil() {
        return perfil;
    }
}