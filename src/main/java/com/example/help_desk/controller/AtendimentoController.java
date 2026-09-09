package com.example.help_desk.controller;

import com.example.help_desk.dto.atendimento.AtendimentoRequestDTO;
import com.example.help_desk.dto.atendimento.AtendimentoResponseDTO;
import com.example.help_desk.model.UsuarioModel;
import com.example.help_desk.service.AtendimentoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/atendimentos")
public class AtendimentoController {

    private final AtendimentoService atendimentoService;

    public AtendimentoController(AtendimentoService atendimentoService) {
        this.atendimentoService = atendimentoService;
    }

    @GetMapping
    public ResponseEntity<List<AtendimentoResponseDTO>> listar(@AuthenticationPrincipal UsuarioModel usuario) {
        return ResponseEntity.ok(atendimentoService.listar(usuario));
    }

    @GetMapping("/chamado/{chamadoId}")
    public ResponseEntity<AtendimentoResponseDTO> buscarPorChamado(
            @PathVariable Long chamadoId,
            @AuthenticationPrincipal UsuarioModel usuario
    ) {
        return ResponseEntity.ok(atendimentoService.buscarPorChamado(chamadoId, usuario));
    }

    @PutMapping
    @PreAuthorize("hasAnyRole('TECNICO','ADMINISTRADOR')")
    public ResponseEntity<AtendimentoResponseDTO> atualizar(
            @Valid @RequestBody AtendimentoRequestDTO dto,
            @AuthenticationPrincipal UsuarioModel usuario
    ) {
        return ResponseEntity.ok(atendimentoService.atualizar(dto, usuario));
    }
}
