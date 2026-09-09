package com.example.help_desk.config;

import com.example.help_desk.model.UsuarioModel;
import com.example.help_desk.model.enums.PerfilUsuario;
import com.example.help_desk.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminInitializerConfig {

    @Bean
    public CommandLineRunner carregarAdminInicial(UsuarioRepository repository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (!repository.existsByPerfil(PerfilUsuario.ADMINISTRADOR)) {
                UsuarioModel admin = new UsuarioModel();
                admin.setNome("Administrador Sistema");
                admin.setEmail("admin@email.com");
                admin.setSenha(passwordEncoder.encode("admin123"));
                admin.setPerfil(PerfilUsuario.ADMINISTRADOR);

                repository.save(admin);
                System.out.println(">>> Usuário ADMIN inicial criado com sucesso: admin@email.com <<<");
            }
        };
    }
}