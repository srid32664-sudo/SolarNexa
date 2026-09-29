package com.example.solarnexa.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.solarnexa.entity.ConsumptionLog;

public interface ConsumptionLogRepository extends JpaRepository<ConsumptionLog, Long> {

    List<ConsumptionLog> findByConsumptionDate(LocalDate consumptionDate);

    List<ConsumptionLog> findByHouseholdId(Long householdId);

    List<ConsumptionLog> findByHouseholdIdAndConsumptionDate(
            Long householdId,
            LocalDate consumptionDate);
}