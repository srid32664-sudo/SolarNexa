package com.example.solarnexa.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.solarnexa.entity.GenerationLog;
import com.example.solarnexa.repository.GenerationLogRepository;

@Service
public class GenerationLogService {

    private final GenerationLogRepository generationLogRepository;

    public GenerationLogService(GenerationLogRepository generationLogRepository) {
        this.generationLogRepository = generationLogRepository;
    }

    public GenerationLog createGenerationLog(GenerationLog generationLog) {

        if (generationLog.getUnitsGenerated() == null
                || generationLog.getUnitsGenerated() < 0) {

            throw new IllegalArgumentException(
                    "Generated energy cannot be negative.");
        }

        if (generationLog.getGenerationDate() == null) {

            throw new IllegalArgumentException(
                    "Generation date is required.");
        }

        if (generationLog.getInstallation() == null) {

            throw new IllegalArgumentException(
                    "Installation is required.");
        }

        return generationLogRepository.save(generationLog);
    }

    public List<GenerationLog> getAllGenerationLogs() {
        return generationLogRepository.findAll();
    }

    public GenerationLog getGenerationLogById(Long id) {

        return generationLogRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Generation record not found with ID: " + id));
    }

    public List<GenerationLog> getGenerationByDate(LocalDate date) {

        return generationLogRepository.findByGenerationDate(date);
    }

    public List<GenerationLog> getGenerationByInstallation(Long installationId) {

        return generationLogRepository.findByInstallationId(installationId);
    }

    public GenerationLog updateGenerationLog(
            Long id,
            GenerationLog updatedGeneration) {

        GenerationLog existingGeneration =
                getGenerationLogById(id);

        if (updatedGeneration.getUnitsGenerated() == null
                || updatedGeneration.getUnitsGenerated() < 0) {

            throw new IllegalArgumentException(
                    "Generated energy cannot be negative.");
        }

        existingGeneration.setGenerationDate(
                updatedGeneration.getGenerationDate());

        existingGeneration.setUnitsGenerated(
                updatedGeneration.getUnitsGenerated());

        existingGeneration.setInstallation(
                updatedGeneration.getInstallation());

        return generationLogRepository.save(existingGeneration);
    }

    public void deleteGenerationLog(Long id) {

        GenerationLog existingGeneration =
                getGenerationLogById(id);

        generationLogRepository.delete(existingGeneration);
    }
}