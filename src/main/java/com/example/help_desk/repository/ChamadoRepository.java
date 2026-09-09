package com.example.help_desk.repository;

import com.example.help_desk.model.ChamadoModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChamadoRepository extends JpaRepository<ChamadoModel, Long> {
    Optional<ChamadoModel> findById(Long id);

    List<ChamadoModel> Id(Long id);

    List<ChamadoModel> id(Long id);
}
