package com.ambulance.app.request.entity;

import com.ambulance.app.vehicle.entity.Vehicle;
import com.ambulance.app.user.entity.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "ambulance_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AmbulanceRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String clientName;

    @Column(nullable = false)
    private String clientPhone;

    // We can keep these or allow them to be nullable if we only rely on gpsLocation
    @Column(nullable = false)
    private String pickupLocation;

    @Column(nullable = false)
    private String destination;
    
    // New fields for Vehicle Request features
    private String vehicleType; // e.g. "ambulance" or "funeral"
    
    private String gpsLocation; // coordinates or exact address

    @Column(columnDefinition = "TEXT")
    private String documentProof; // base64 representation of the uploaded file

    // New field for scheduling
    private String scheduledDate;

    @Column(nullable = false)
    private String status; // PENDING, ACCEPTED, IN_PROGRESS, COMPLETED, CANCELLED

    private LocalDateTime requestTime;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(columnDefinition = "TEXT")
    private String rejectionReason;
}
