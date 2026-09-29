package com.example.solarnexa.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.solarnexa.entity.Installation;

public interface InstallationRepository extends JpaRepository<Installation, Long> {

}