package com.ambulance.app.vehicle.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "vehicles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String plateNumber;

    @Column(nullable = false)
    private String model;

    @Column(nullable = false)
    private String type; // e.g., AMBULANCE, FUNERAL_CAR

    @Builder.Default
    private boolean available = true;

    private String currentLocation;
}
