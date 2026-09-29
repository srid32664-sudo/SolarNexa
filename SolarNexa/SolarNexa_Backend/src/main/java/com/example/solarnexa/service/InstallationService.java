package com.example.solarnexa.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.solarnexa.entity.Installation;
import com.example.solarnexa.repository.InstallationRepository;

@Service
public class InstallationService {

    private final InstallationRepository installationRepository;

    public InstallationService(InstallationRepository installationRepository) {
        this.installationRepository = installationRepository;
    }

    public Installation createInstallation(Installation installation) {
        return installationRepository.save(installation);
    }

    public List<Installation> getAllInstallations() {
        return installationRepository.findAll();
    }

    public Installation getInstallationById(Long id) {
        return installationRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Installation not found with ID: " + id));
    }

    public Installation updateInstallation(Long id, Installation updatedInstallation) {

        Installation existingInstallation = getInstallationById(id);

        existingInstallation.setName(updatedInstallation.getName());
        existingInstallation.setLocation(updatedInstallation.getLocation());
        existingInstallation.setCapacityKw(updatedInstallation.getCapacityKw());

        return installationRepository.save(existingInstallation);
    }

    public void deleteInstallation(Long id) {

        Installation existingInstallation = getInstallationById(id);

        installationRepository.delete(existingInstallation);
    }
}