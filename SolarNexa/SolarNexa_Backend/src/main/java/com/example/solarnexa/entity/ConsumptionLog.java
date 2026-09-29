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
@Table(name = "consumption_log")
public class ConsumptionLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate consumptionDate;

    private Double unitsConsumed;

    private Double unitsExported;

    @ManyToOne
    @JoinColumn(name = "household_id", nullable = false)
    private Household household;

    public ConsumptionLog() {
    }

    public ConsumptionLog(
            LocalDate consumptionDate,
            Double unitsConsumed,
            Double unitsExported,
            Household household) {

        this.consumptionDate = consumptionDate;
        this.unitsConsumed = unitsConsumed;
        this.unitsExported = unitsExported;
        this.household = household;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getConsumptionDate() {
        return consumptionDate;
    }

    public void setConsumptionDate(LocalDate consumptionDate) {
        this.consumptionDate = consumptionDate;
    }

    public Double getUnitsConsumed() {
        return unitsConsumed;
    }

    public void setUnitsConsumed(Double unitsConsumed) {
        this.unitsConsumed = unitsConsumed;
    }

    public Double getUnitsExported() {
        return unitsExported;
    }

    public void setUnitsExported(Double unitsExported) {
        this.unitsExported = unitsExported;
    }

    public Household getHousehold() {
        return household;
    }

    public void setHousehold(Household household) {
        this.household = household;
    }
}