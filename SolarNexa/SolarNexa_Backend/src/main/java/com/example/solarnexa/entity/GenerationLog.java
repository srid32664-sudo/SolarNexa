package com.example.solarnexa.entity;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "generation_log")
public class GenerationLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate generationDate;

    private Double unitsGenerated;

    @ManyToOne
    @JoinColumn(name = "installation_id", nullable = false)
    private Installation installation;

    public GenerationLog() {
    }

    public GenerationLog(LocalDate generationDate, Double unitsGenerated, Installation installation) {
        this.generationDate = generationDate;
        this.unitsGenerated = unitsGenerated;
        this.installation = installation;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getGenerationDate() {
        return generationDate;
    }

    public void setGenerationDate(LocalDate generationDate) {
        this.generationDate = generationDate;
    }

    public Double getUnitsGenerated() {
        return unitsGenerated;
    }

    public void setUnitsGenerated(Double unitsGenerated) {
        this.unitsGenerated = unitsGenerated;
    }

    public Installation getInstallation() {
        return installation;
    }

    public void setInstallation(Installation installation) {
        this.installation = installation;
    }
}