package com.example.solarnexa.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "household")
public class Household {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String householdName;

    private Double allocationRatio;

    @ManyToOne
    @JoinColumn(name = "installation_id", nullable = false)
    private Installation installation;

    public Household() {
    }

    public Household(String householdName, Double allocationRatio, Installation installation) {
        this.householdName = householdName;
        this.allocationRatio = allocationRatio;
        this.installation = installation;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getHouseholdName() {
        return householdName;
    }

    public void setHouseholdName(String householdName) {
        this.householdName = householdName;
    }

    public Double getAllocationRatio() {
        return allocationRatio;
    }

    public void setAllocationRatio(Double allocationRatio) {
        this.allocationRatio = allocationRatio;
    }

    public Installation getInstallation() {
        return installation;
    }

    public void setInstallation(Installation installation) {
        this.installation = installation;
    }
}