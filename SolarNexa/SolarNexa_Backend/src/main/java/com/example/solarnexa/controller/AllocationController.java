package com.example.solarnexa.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.solarnexa.dto.AllocationResult;
import com.example.solarnexa.service.AllocationService;

@RestController
@RequestMapping("/api/allocation")
public class AllocationController {

    private final AllocationService allocationService;

    public AllocationController(
            AllocationService allocationService) {

        this.allocationService = allocationService;
    }

    @GetMapping("/installation/{installationId}")
    public ResponseEntity<List<AllocationResult>>
    calculateAllocation(
            @PathVariable Long installationId,
            @RequestParam LocalDate date) {

        return ResponseEntity.ok(
                allocationService.calculateAllocation(
                        installationId,
                        date));
    }
}