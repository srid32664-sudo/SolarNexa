package com.example.solarnexa.dto;

public class DashboardSummary {

    private Double totalCapacityKw;
    private Double todayGeneration;
    private Long totalHouseholds;
    private Double totalAllocatedEnergy;
    private Double totalConsumption;
    private Double totalExportedEnergy;

    public DashboardSummary() {
    }

    public DashboardSummary(
            Double totalCapacityKw,
            Double todayGeneration,
            Long totalHouseholds,
            Double totalAllocatedEnergy,
            Double totalConsumption,
            Double totalExportedEnergy) {

        this.totalCapacityKw = totalCapacityKw;
        this.todayGeneration = todayGeneration;
        this.totalHouseholds = totalHouseholds;
        this.totalAllocatedEnergy = totalAllocatedEnergy;
        this.totalConsumption = totalConsumption;
        this.totalExportedEnergy = totalExportedEnergy;
    }

    public Double getTotalCapacityKw() {
        return totalCapacityKw;
    }

    public void setTotalCapacityKw(Double totalCapacityKw) {
        this.totalCapacityKw = totalCapacityKw;
    }

    public Double getTodayGeneration() {
        return todayGeneration;
    }

    public void setTodayGeneration(Double todayGeneration) {
        this.todayGeneration = todayGeneration;
    }

    public Long getTotalHouseholds() {
        return totalHouseholds;
    }

    public void setTotalHouseholds(Long totalHouseholds) {
        this.totalHouseholds = totalHouseholds;
    }

    public Double getTotalAllocatedEnergy() {
        return totalAllocatedEnergy;
    }

    public void setTotalAllocatedEnergy(Double totalAllocatedEnergy) {
        this.totalAllocatedEnergy = totalAllocatedEnergy;
    }

    public Double getTotalConsumption() {
        return totalConsumption;
    }

    public void setTotalConsumption(Double totalConsumption) {
        this.totalConsumption = totalConsumption;
    }

    public Double getTotalExportedEnergy() {
        return totalExportedEnergy;
    }

    public void setTotalExportedEnergy(Double totalExportedEnergy) {
        this.totalExportedEnergy = totalExportedEnergy;
    }
}