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

import com.example.solarnexa.entity.ConsumptionLog;
import com.example.solarnexa.service.ConsumptionLogService;

@RestController
@RequestMapping("/api/consumption")
public class ConsumptionLogController {

    private final ConsumptionLogService consumptionLogService;

    public ConsumptionLogController(
            ConsumptionLogService consumptionLogService) {

        this.consumptionLogService = consumptionLogService;
    }

    @PostMapping
    public ResponseEntity<ConsumptionLog> createConsumptionLog(
            @RequestBody ConsumptionLog consumptionLog) {

        ConsumptionLog savedConsumption =
                consumptionLogService
                        .createConsumptionLog(consumptionLog);

        return new ResponseEntity<>(
                savedConsumption,
                HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ConsumptionLog>>
    getAllConsumptionLogs() {

        return ResponseEntity.ok(
                consumptionLogService.getAllConsumptionLogs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ConsumptionLog> getConsumptionLogById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                consumptionLogService
                        .getConsumptionLogById(id));
    }

    @GetMapping("/household/{householdId}")
    public ResponseEntity<List<ConsumptionLog>>
    getConsumptionByHousehold(
            @PathVariable Long householdId) {

        return ResponseEntity.ok(
                consumptionLogService
                        .getConsumptionByHousehold(householdId));
    }

    @GetMapping("/date")
    public ResponseEntity<List<ConsumptionLog>>
    getConsumptionByDate(
            @RequestParam LocalDate date) {

        return ResponseEntity.ok(
                consumptionLogService
                        .getConsumptionByDate(date));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ConsumptionLog> updateConsumptionLog(
            @PathVariable Long id,
            @RequestBody ConsumptionLog consumptionLog) {

        return ResponseEntity.ok(
                consumptionLogService.updateConsumptionLog(
                        id,
                        consumptionLog));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteConsumptionLog(
            @PathVariable Long id) {

        consumptionLogService.deleteConsumptionLog(id);

        return ResponseEntity.ok(
                "Consumption record deleted successfully.");
    }
}