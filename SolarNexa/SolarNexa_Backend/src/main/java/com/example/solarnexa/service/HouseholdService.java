package com.example.solarnexa.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.solarnexa.entity.Household;
import com.example.solarnexa.repository.HouseholdRepository;

@Service
public class HouseholdService {

    private final HouseholdRepository householdRepository;

    public HouseholdService(HouseholdRepository householdRepository) {
        this.householdRepository = householdRepository;
    }

    // Create household
    public Household createHousehold(Household household) {
        validateHousehold(household, null);
        return householdRepository.save(household);
    }

    // Get all households
    public List<Household> getAllHouseholds() {
        return householdRepository.findAll();
    }

    // Get household by ID
    public Household getHouseholdById(Long id) {
        return householdRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Household not found with ID: " + id));
    }

    // Get households by installation
    public List<Household> getHouseholdsByInstallation(Long installationId) {
        return householdRepository.findByInstallationId(installationId);
    }

    // Update household
    public Household updateHousehold(Long id, Household household) {

        Household existingHousehold = getHouseholdById(id);

        validateHousehold(household, id);

        existingHousehold.setHouseholdName(household.getHouseholdName());
        existingHousehold.setAllocationRatio(household.getAllocationRatio());
        existingHousehold.setInstallation(household.getInstallation());

        return householdRepository.save(existingHousehold);
    }

    // Delete household
    public void deleteHousehold(Long id) {

        if (!householdRepository.existsById(id)) {
            throw new RuntimeException("Household not found with ID: " + id);
        }

        householdRepository.deleteById(id);
    }

    // Validation
    private void validateHousehold(Household household, Long excludedId) {

        if (household == null) {
            throw new IllegalArgumentException("Household data is required.");
        }

        if (household.getHouseholdName() == null ||
                household.getHouseholdName().trim().isEmpty()) {

            throw new IllegalArgumentException("Household name is required.");
        }

        if (household.getAllocationRatio() == null) {
            throw new IllegalArgumentException("Allocation ratio is required.");
        }

        if (household.getAllocationRatio() < 0 ||
                household.getAllocationRatio() > 100) {

            throw new IllegalArgumentException(
                    "Allocation ratio must be between 0 and 100.");
        }

        if (household.getInstallation() == null ||
                household.getInstallation().getId() == null) {

            throw new IllegalArgumentException(
                    "Installation is required.");
        }

        Long installationId = household.getInstallation().getId();

        // Get existing households for this installation
        List<Household> existingHouseholds =
                householdRepository.findByInstallationId(installationId);

        double totalAllocation = household.getAllocationRatio();

        for (Household existing : existingHouseholds) {

            // Ignore the current household during update
            if (excludedId != null &&
                    existing.getId().equals(excludedId)) {
                continue;
            }

            if (existing.getAllocationRatio() != null) {
                totalAllocation += existing.getAllocationRatio();
            }
        }

        // Total allocation cannot exceed 100%
        if (totalAllocation > 100.0) {

            throw new IllegalArgumentException(
                    "Total household allocation cannot exceed 100% for this installation.");
        }
    }
}