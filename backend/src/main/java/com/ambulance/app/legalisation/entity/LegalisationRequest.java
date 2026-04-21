package com.ambulance.app.legalisation.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import com.ambulance.app.user.entity.User;

import java.time.LocalDateTime;

@Entity
@Table(name = "legalisation_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LegalisationRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String documentType; // e.g. "SIGNATURE", "TRUE_COPY"
    
    private String clientName;
    private String clientPhone;
    private String cin;
    
    @Column(nullable = false)
    private String appointmentDate;

    @Column(columnDefinition = "TEXT")
    private String documentProof; 

    @Column(columnDefinition = "TEXT")
    private String originalDocumentProof; // For true copy

    @Column(nullable = false)
    private String status; // PENDING, ACCEPTED, IN_PROGRESS, COMPLETED, CANCELLED

    private LocalDateTime requestTime;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(columnDefinition = "TEXT")
    private String rejectionReason;
}
