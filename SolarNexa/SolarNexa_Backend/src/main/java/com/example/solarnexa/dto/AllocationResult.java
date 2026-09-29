package com.example.solarnexa.dto;

public class AllocationResult {

    private Long householdId;
    private String householdName;
    private Double allocationRatio;
    private Double generatedEnergy;
    private Double allocatedEnergy;
    private Double consumedEnergy;
    private Double exportedEnergy;
    private Double netUsage;

    public AllocationResult() {
    }

    public AllocationResult(
            Long householdId,
            String householdName,
            Double allocationRatio,
            Double generatedEnergy,
            Double allocatedEnergy,
            Double consumedEnergy,
            Double exportedEnergy,
            Double netUsage) {

        this.householdId = householdId;
        this.householdName = householdName;
        this.allocationRatio = allocationRatio;
        this.generatedEnergy = generatedEnergy;
        this.allocatedEnergy = allocatedEnergy;
        this.consumedEnergy = consumedEnergy;
        this.exportedEnergy = exportedEnergy;
        this.netUsage = netUsage;
    }

    public Long getHouseholdId() {
        return householdId;
    }

    public void setHouseholdId(Long householdId) {
        this.householdId = householdId;
    }

    public String getHouseholdName() {
        return householdName;
    }

    public void setHouseholdName(String householdName) {
        this.householdName = householdName;
    }

    public Double getAllocationRatio() {
        return allocationRatio;
    }

    public void setAllocationRatio(Double allocationRatio) {
        this.allocationRatio = allocationRatio;
    }

    public Double getGeneratedEnergy() {
        return generatedEnergy;
    }

    public void setGeneratedEnergy(Double generatedEnergy) {
        this.generatedEnergy = generatedEnergy;
    }

    public Double getAllocatedEnergy() {
        return allocatedEnergy;
    }

    public void setAllocatedEnergy(Double allocatedEnergy) {
        this.allocatedEnergy = allocatedEnergy;
    }

    public Double getConsumedEnergy() {
        return consumedEnergy;
    }

    public void setConsumedEnergy(Double consumedEnergy) {
        this.consumedEnergy = consumedEnergy;
    }

    public Double getExportedEnergy() {
        return exportedEnergy;
    }

    public void setExportedEnergy(Double exportedEnergy) {
        this.exportedEnergy = exportedEnergy;
    }

    public Double getNetUsage() {
        return netUsage;
    }

    public void setNetUsage(Double netUsage) {
        this.netUsage = netUsage;
    }
}