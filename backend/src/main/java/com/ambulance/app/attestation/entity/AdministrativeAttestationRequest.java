package com.ambulance.app.attestation.entity;

import com.ambulance.app.user.entity.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "administrative_attestation_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdministrativeAttestationRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String clientName;
    private String clientPhone;
    private String cin;
    private String propertyAddress;
    private String appointmentDate;

    @Column(columnDefinition = "TEXT")
    private String saleDonationSadaqaProof;

    @Column(columnDefinition = "TEXT")
    private String ownershipCertificateProof;

    @Column(nullable = false)
    private String status;

    private LocalDateTime requestTime;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(columnDefinition = "TEXT")
    private String rejectionReason;
}
