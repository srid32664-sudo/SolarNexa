package com.example.solarnexa.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "installation")
public class Installation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String location;

    private Double capacityKw;

    public Installation() {
    }

    public Installation(String name, String location, Double capacityKw) {
        this.name = name;
        this.location = location;
        this.capacityKw = capacityKw;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Double getCapacityKw() {
        return capacityKw;
    }

    public void setCapacityKw(Double capacityKw) {
        this.capacityKw = capacityKw;
    }
}