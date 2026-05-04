package com.ambulance.app.authorization.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import com.ambulance.app.user.entity.User;

import java.time.LocalDateTime;

@Entity
@Table(name = "authorization_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthorizationRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String authorizationType; // "ELECTRICITY" or "WATER"

    private String clientName;
    private String clientPhone;
    private String cin;

    @Column(columnDefinition = "TEXT")
    private String nationalIdCardProof;

    @Column(columnDefinition = "TEXT")
    private String constructionPermitProof;

    @Column(columnDefinition = "TEXT")
    private String habitationPermitProof;

    @Column(columnDefinition = "TEXT")
    private String stabilityCertificateProof;

    @Column(columnDefinition = "TEXT")
    private String commissionNoticeProof;

    @Column(nullable = false)
    private String status; // PENDING, ACCEPTED, CANCELLED

    private LocalDateTime requestTime;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(columnDefinition = "TEXT")
    private String rejectionReason;
}
