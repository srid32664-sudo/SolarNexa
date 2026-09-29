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

import com.example.solarnexa.entity.Installation;
import com.example.solarnexa.service.InstallationService;

@RestController
@RequestMapping("/api/installations")
public class InstallationController {

    private final InstallationService installationService;

    public InstallationController(InstallationService installationService) {
        this.installationService = installationService;
    }

    @PostMapping
    public ResponseEntity<Installation> createInstallation(
            @RequestBody Installation installation) {

        Installation savedInstallation =
                installationService.createInstallation(installation);

        return new ResponseEntity<>(
                savedInstallation,
                HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Installation>> getAllInstallations() {

        return ResponseEntity.ok(
                installationService.getAllInstallations());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Installation> getInstallationById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                installationService.getInstallationById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Installation> updateInstallation(
            @PathVariable Long id,
            @RequestBody Installation installation) {

        return ResponseEntity.ok(
                installationService.updateInstallation(
                        id,
                        installation));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteInstallation(
            @PathVariable Long id) {

        installationService.deleteInstallation(id);

        return ResponseEntity.ok(
                "Installation deleted successfully.");
    }
}