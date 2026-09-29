package com.example.solarnexa.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.solarnexa.entity.ConsumptionLog;
import com.example.solarnexa.repository.ConsumptionLogRepository;

@Service
public class ConsumptionLogService {

    private final ConsumptionLogRepository consumptionLogRepository;

    public ConsumptionLogService(
            ConsumptionLogRepository consumptionLogRepository) {

        this.consumptionLogRepository = consumptionLogRepository;
    }

    public ConsumptionLog createConsumptionLog(
            ConsumptionLog consumptionLog) {

        validateConsumptionLog(consumptionLog);

        return consumptionLogRepository.save(consumptionLog);
    }

    public List<ConsumptionLog> getAllConsumptionLogs() {

        return consumptionLogRepository.findAll();
    }

    public ConsumptionLog getConsumptionLogById(Long id) {

        return consumptionLogRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Consumption record not found with ID: " + id));
    }

    public List<ConsumptionLog> getConsumptionByHousehold(
            Long householdId) {

        return consumptionLogRepository
                .findByHouseholdId(householdId);
    }

    public List<ConsumptionLog> getConsumptionByDate(
            LocalDate date) {

        return consumptionLogRepository
                .findByConsumptionDate(date);
    }

    public ConsumptionLog updateConsumptionLog(
            Long id,
            ConsumptionLog updatedConsumption) {

        validateConsumptionLog(updatedConsumption);

        ConsumptionLog existingConsumption =
                getConsumptionLogById(id);

        existingConsumption.setConsumptionDate(
                updatedConsumption.getConsumptionDate());

        existingConsumption.setUnitsConsumed(
                updatedConsumption.getUnitsConsumed());

        existingConsumption.setUnitsExported(
                updatedConsumption.getUnitsExported());

        existingConsumption.setHousehold(
                updatedConsumption.getHousehold());

        return consumptionLogRepository.save(existingConsumption);
    }

    public void deleteConsumptionLog(Long id) {

        ConsumptionLog existingConsumption =
                getConsumptionLogById(id);

        consumptionLogRepository.delete(existingConsumption);
    }

    private void validateConsumptionLog(
            ConsumptionLog consumptionLog) {

        if (consumptionLog.getConsumptionDate() == null) {

            throw new IllegalArgumentException(
                    "Consumption date is required.");
        }

        if (consumptionLog.getUnitsConsumed() == null
                || consumptionLog.getUnitsConsumed() < 0) {

            throw new IllegalArgumentException(
                    "Consumed energy cannot be negative.");
        }

        if (consumptionLog.getUnitsExported() == null
                || consumptionLog.getUnitsExported() < 0) {

            throw new IllegalArgumentException(
                    "Exported energy cannot be negative.");
        }

        if (consumptionLog.getHousehold() == null) {

            throw new IllegalArgumentException(
                    "Household is required.");
        }
    }
}