package com.example.solarnexa.controller;

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
import org.springframework.web.bind.annotation.RestController;

import com.example.solarnexa.entity.Household;
import com.example.solarnexa.service.HouseholdService;

@RestController
@RequestMapping("/api/households")
public class HouseholdController {

    private final HouseholdService householdService;

    public HouseholdController(HouseholdService householdService) {
        this.householdService = householdService;
    }

    @PostMapping
    public ResponseEntity<Household> createHousehold(
            @RequestBody Household household) {

        Household savedHousehold =
                householdService.createHousehold(household);

        return new ResponseEntity<>(
                savedHousehold,
                HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Household>> getAllHouseholds() {

        return ResponseEntity.ok(
                householdService.getAllHouseholds());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Household> getHouseholdById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                householdService.getHouseholdById(id));
    }

    @GetMapping("/installation/{installationId}")
    public ResponseEntity<List<Household>>
    getHouseholdsByInstallation(
            @PathVariable Long installationId) {

        return ResponseEntity.ok(
                householdService
                        .getHouseholdsByInstallation(installationId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Household> updateHousehold(
            @PathVariable Long id,
            @RequestBody Household household) {

        return ResponseEntity.ok(
                householdService.updateHousehold(
                        id,
                        household));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteHousehold(
            @PathVariable Long id) {

        householdService.deleteHousehold(id);

        return ResponseEntity.ok(
                "Household deleted successfully.");
    }
}