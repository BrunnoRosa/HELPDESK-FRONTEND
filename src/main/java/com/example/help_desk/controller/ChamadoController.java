package com.example.help_desk.controller;

import com.example.help_desk.dto.chamado.ChamadoRequestDTO;
import com.example.help_desk.dto.chamado.ChamadoResponseDTO;
import com.example.help_desk.model.ChamadoModel;
import com.example.help_desk.model.UsuarioModel;
import com.example.help_desk.service.AtendimentoService;
import com.example.help_desk.service.ChamadoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/chamados")
public class ChamadoController {

    @Autowired
    private ChamadoService service;

    @Autowired
    private AtendimentoService atendimentoService;

    @GetMapping
    public ResponseEntity<List<ChamadoResponseDTO>> listar(@AuthenticationPrincipal UsuarioModel usuario) {
        UsuarioModel model = (UsuarioModel) usuario;
        return ResponseEntity.status(HttpStatus.OK).body(service.listar(usuario));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ChamadoResponseDTO> buscarPorId(
            @PathVariable Long id,
            @AuthenticationPrincipal UsuarioModel usuario
    ) {
        return ResponseEntity.status(HttpStatus.OK).body(service.buscarPorId(id, usuario));
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> salvar(
            @Valid @RequestBody ChamadoRequestDTO salvarDTO,
            @AuthenticationPrincipal UsuarioModel usuario
    ) {
        ChamadoModel chamado = service.salvar(salvarDTO);
        atendimentoService.criarInicial(chamado.getId(), usuario);

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "Mensagem", "Chamado salvo com sucesso",
                "id", chamado.getId()
        ));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('TECNICO','ADMINISTRADOR')")
    public ResponseEntity<Map<String, Object>> atualizar(
            @PathVariable Long id,
            @RequestBody @Valid ChamadoRequestDTO atualizarDTO
    ) {
        service.atualizar(id, atualizarDTO);
        return ResponseEntity.status(HttpStatus.OK).body(Map.of("Mensagem", "Chamado atualizado com sucesso"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Map<String, Object>> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.status(HttpStatus.OK).body(Map.of("Mensagem", "Chamado deletado"));
    }
}
