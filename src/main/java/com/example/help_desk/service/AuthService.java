package com.example.help_desk.service;

import com.example.help_desk.dto.auth.LoginRequestDTO;
import com.example.help_desk.dto.auth.LoginResponseDTO;
import com.example.help_desk.dto.usuario.UsuarioRequestDTO;
import com.example.help_desk.dto.usuario.UsuarioResponseDTO;
import com.example.help_desk.model.UsuarioModel;
import com.example.help_desk.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UsuarioService usuarioService;
    private final JwtService jwtService;

    public AuthService(AuthenticationManager authenticationManager, UsuarioService usuarioService, JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.usuarioService = usuarioService;
        this.jwtService = jwtService;
    }

    public UsuarioResponseDTO registrar(UsuarioRequestDTO dto) {
        return usuarioService.cadastrar(dto);
    }

    public LoginResponseDTO login(LoginRequestDTO dto) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getSenha())
        );

        UsuarioModel usuario = usuarioService.buscarPorEmail(dto.getEmail());
        String token = jwtService.gerarToken(usuario);
        return new LoginResponseDTO(token, usuario);
    }
}
