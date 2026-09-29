package com.example.solarnexa.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.solarnexa.dto.DashboardSummary;
import com.example.solarnexa.entity.ConsumptionLog;
import com.example.solarnexa.entity.GenerationLog;
import com.example.solarnexa.entity.Installation;
import com.example.solarnexa.repository.ConsumptionLogRepository;
import com.example.solarnexa.repository.GenerationLogRepository;
import com.example.solarnexa.repository.HouseholdRepository;
import com.example.solarnexa.repository.InstallationRepository;

@Service
public class DashboardService {

    private final InstallationRepository installationRepository;
    private final GenerationLogRepository generationLogRepository;
    private final HouseholdRepository householdRepository;
    private final ConsumptionLogRepository consumptionLogRepository;

    public DashboardService(
            InstallationRepository installationRepository,
            GenerationLogRepository generationLogRepository,
            HouseholdRepository householdRepository,
            ConsumptionLogRepository consumptionLogRepository) {

        this.installationRepository = installationRepository;
        this.generationLogRepository = generationLogRepository;
        this.householdRepository = householdRepository;
        this.consumptionLogRepository = consumptionLogRepository;
    }

    public DashboardSummary getDashboardSummary() {

        LocalDate today = LocalDate.now();

        List<Installation> installations =
                installationRepository.findAll();

        double totalCapacity = 0.0;

        for (Installation installation : installations) {

            if (installation.getCapacityKw() != null) {
                totalCapacity += installation.getCapacityKw();
            }
        }

        List<GenerationLog> generationLogs =
                generationLogRepository.findByGenerationDate(today);

        double todayGeneration = 0.0;

        for (GenerationLog generation : generationLogs) {

            if (generation.getUnitsGenerated() != null) {
                todayGeneration += generation.getUnitsGenerated();
            }
        }

        long totalHouseholds =
                householdRepository.count();

        List<ConsumptionLog> consumptionLogs =
                consumptionLogRepository
                        .findByConsumptionDate(today);

        double totalConsumption = 0.0;
        double totalExportedEnergy = 0.0;

        for (ConsumptionLog consumption : consumptionLogs) {

            if (consumption.getUnitsConsumed() != null) {

                totalConsumption +=
                        consumption.getUnitsConsumed();
            }

            if (consumption.getUnitsExported() != null) {

                totalExportedEnergy +=
                        consumption.getUnitsExported();
            }
        }

        double totalAllocatedEnergy =
                calculateAllocatedEnergy(
                        generationLogs);

        return new DashboardSummary(
                totalCapacity,
                todayGeneration,
                totalHouseholds,
                totalAllocatedEnergy,
                totalConsumption,
                totalExportedEnergy
        );
    }

    private double calculateAllocatedEnergy(
            List<GenerationLog> generationLogs) {

        double totalAllocated = 0.0;

        for (GenerationLog generation : generationLogs) {

            if (generation.getInstallation() == null) {
                continue;
            }

            Long installationId =
                    generation.getInstallation().getId();

            if (installationId == null) {
                continue;
            }

            List<com.example.solarnexa.entity.Household> households =
                    householdRepository
                            .findByInstallationId(
                                    installationId);

            for (com.example.solarnexa.entity.Household household
                    : households) {

                if (household.getAllocationRatio() != null) {

                    double allocated =
                            generation.getUnitsGenerated()
                                    * household.getAllocationRatio()
                                    / 100.0;

                    totalAllocated += allocated;
                }
            }
        }

        return totalAllocated;
    }
}