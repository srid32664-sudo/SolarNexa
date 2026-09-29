package com.example.solarnexa.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.solarnexa.dto.AllocationResult;
import com.example.solarnexa.entity.ConsumptionLog;
import com.example.solarnexa.entity.GenerationLog;
import com.example.solarnexa.entity.Household;
import com.example.solarnexa.repository.ConsumptionLogRepository;
import com.example.solarnexa.repository.GenerationLogRepository;
import com.example.solarnexa.repository.HouseholdRepository;

@Service
public class AllocationService {

    private final GenerationLogRepository generationLogRepository;
    private final HouseholdRepository householdRepository;
    private final ConsumptionLogRepository consumptionLogRepository;

    public AllocationService(
            GenerationLogRepository generationLogRepository,
            HouseholdRepository householdRepository,
            ConsumptionLogRepository consumptionLogRepository) {

        this.generationLogRepository = generationLogRepository;
        this.householdRepository = householdRepository;
        this.consumptionLogRepository = consumptionLogRepository;
    }

    public List<AllocationResult> calculateAllocation(
            Long installationId,
            LocalDate date) {

        List<GenerationLog> generationLogs =
                generationLogRepository.findByGenerationDate(date);

        GenerationLog selectedGeneration = null;

        for (GenerationLog generation : generationLogs) {

            if (generation.getInstallation() != null
                    && generation.getInstallation().getId() != null
                    && generation.getInstallation().getId()
                            .equals(installationId)) {

                selectedGeneration = generation;
                break;
            }
        }

        if (selectedGeneration == null) {

            throw new RuntimeException(
                    "No generation record found for this installation and date.");
        }

        Double generatedEnergy =
                selectedGeneration.getUnitsGenerated();

        List<Household> households =
                householdRepository
                        .findByInstallationId(installationId);

        if (households.isEmpty()) {

            throw new RuntimeException(
                    "No households found for this installation.");
        }

        double totalAllocationRatio = 0.0;

        for (Household household : households) {

            if (household.getAllocationRatio() == null) {

                throw new IllegalArgumentException(
                        "Allocation ratio is missing for household: "
                                + household.getHouseholdName());
            }

            totalAllocationRatio +=
                    household.getAllocationRatio();
        }

        if (totalAllocationRatio > 100.0) {

            throw new IllegalArgumentException(
                    "Total household allocation cannot exceed 100%.");
        }

        List<AllocationResult> results =
                new ArrayList<>();

        for (Household household : households) {

            double ratio =
                    household.getAllocationRatio();

            double allocatedEnergy =
                    generatedEnergy * ratio / 100.0;

            List<ConsumptionLog> consumptionLogs =
                    consumptionLogRepository
                            .findByHouseholdIdAndConsumptionDate(
                                    household.getId(),
                                    date);

            double consumedEnergy = 0.0;

            for (ConsumptionLog consumption : consumptionLogs) {

                if (consumption.getUnitsConsumed() != null) {

                    consumedEnergy +=
                            consumption.getUnitsConsumed();
                }
            }

            double netUsage =
                    allocatedEnergy - consumedEnergy;

            if (netUsage < 0) {

                netUsage = 0.0;
            }

            double exportedEnergy =
                    Math.max(0.0, netUsage);

            AllocationResult result =
                    new AllocationResult(
                            household.getId(),
                            household.getHouseholdName(),
                            ratio,
                            generatedEnergy,
                            allocatedEnergy,
                            consumedEnergy,
                            exportedEnergy,
                            netUsage
                    );

            results.add(result);
        }

        return results;
    }
}