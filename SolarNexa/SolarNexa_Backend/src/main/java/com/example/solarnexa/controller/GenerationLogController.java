package com.example.solarnexa.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.solarnexa.entity.GenerationLog;
import com.example.solarnexa.service.GenerationLogService;

@RestController
@RequestMapping("/api/generation")
public class GenerationLogController {

    private final GenerationLogService generationLogService;

    public GenerationLogController(
            GenerationLogService generationLogService) {

        this.generationLogService = generationLogService;
    }

    @PostMapping
    public ResponseEntity<GenerationLog> createGenerationLog(
            @RequestBody GenerationLog generationLog) {

        GenerationLog savedGeneration =
                generationLogService.createGenerationLog(
                        generationLog);

        return new ResponseEntity<>(
                savedGeneration,
                HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<GenerationLog>> getAllGenerationLogs() {

        return ResponseEntity.ok(
                generationLogService.getAllGenerationLogs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<GenerationLog> getGenerationLogById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                generationLogService.getGenerationLogById(id));
    }

    @GetMapping("/date")
    public ResponseEntity<List<GenerationLog>> getGenerationByDate(
            @RequestParam LocalDate date) {

        return ResponseEntity.ok(
                generationLogService.getGenerationByDate(date));
    }

    @GetMapping("/installation/{installationId}")
    public ResponseEntity<List<GenerationLog>>
    getGenerationByInstallation(
            @PathVariable Long installationId) {

        return ResponseEntity.ok(
                generationLogService
                        .getGenerationByInstallation(installationId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GenerationLog> updateGenerationLog(
            @PathVariable Long id,
            @RequestBody GenerationLog generationLog) {

        return ResponseEntity.ok(
                generationLogService.updateGenerationLog(
                        id,
                        generationLog));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteGenerationLog(
            @PathVariable Long id) {

        generationLogService.deleteGenerationLog(id);

        return ResponseEntity.ok(
                "Generation record deleted successfully.");
    }
}