package com.example.solarnexa.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.solarnexa.entity.GenerationLog;

public interface GenerationLogRepository extends JpaRepository<GenerationLog, Long> {

    List<GenerationLog> findByGenerationDate(LocalDate generationDate);

    List<GenerationLog> findByInstallationId(Long installationId);
}