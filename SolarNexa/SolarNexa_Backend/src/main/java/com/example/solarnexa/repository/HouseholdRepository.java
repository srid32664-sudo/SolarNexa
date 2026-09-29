package com.example.solarnexa.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.solarnexa.entity.Household;

public interface HouseholdRepository extends JpaRepository<Household, Long> {

    List<Household> findByInstallationId(Long installationId);
}