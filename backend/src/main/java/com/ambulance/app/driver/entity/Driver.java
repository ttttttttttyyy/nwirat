package com.ambulance.app.driver.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "drivers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Driver {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String phone;
    private String cin;
    private String licenseNumber;

    @Builder.Default
    private boolean available = true;

    @Builder.Default
    private String status = "AVAILABLE"; // AVAILABLE, ON_MISSION, UNAVAILABLE
}
