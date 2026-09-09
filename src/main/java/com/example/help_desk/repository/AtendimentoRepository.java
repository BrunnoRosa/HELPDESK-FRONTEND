package com.example.help_desk.repository;

import com.example.help_desk.model.AtendimentoModel;
import com.example.help_desk.model.enums.StatusChamado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AtendimentoRepository extends JpaRepository<AtendimentoModel, Long> {

    Optional<AtendimentoModel> findByChamadoId(Long chamadoId);

    List<AtendimentoModel> findAllBySolicitanteId(Long solicitanteId);

    long countByStatus(StatusChamado status);

    long countBySolicitanteId(Long solicitanteId);

    long countByTecnicoResponsavelId(Long tecnicoResponsavelId);

    void deleteByChamadoId(Long chamadoId);
}
