package com.ambulance.app.civilstatus.entity;

import com.ambulance.app.user.entity.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "civil_status_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CivilStatusRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String requestType;

    private String clientName;
    private String clientPhone;
    private String cin;
    private String appointmentDate;
    private Integer feeAmount;
    private Boolean isFirstChild;
    private Boolean isDivorced;
    private Boolean isWidowed;
    private Boolean hasMultipleWives;

    @Column(columnDefinition = "TEXT")
    private String requiredDocumentsProof;

    @Column(columnDefinition = "TEXT")
    private String medicalDeathCertificateProof;

    @Column(columnDefinition = "TEXT")
    private String administrativeDeathCertificateProof;

    @Column(columnDefinition = "TEXT")
    private String fullCopyOrBirthActProof;

    @Column(columnDefinition = "TEXT")
    private String birthMedicalCertificateProof;

    @Column(columnDefinition = "TEXT")
    private String marriageActProof;

    @Column(columnDefinition = "TEXT")
    private String husbandCinProof;

    @Column(columnDefinition = "TEXT")
    private String wifeCinProof;

    @Column(columnDefinition = "TEXT")
    private String husbandFullCopyProof;

    @Column(columnDefinition = "TEXT")
    private String wifeFullCopyProof;

    @Column(columnDefinition = "TEXT")
    private String honorDeclarationProof;

    @Column(columnDefinition = "TEXT")
    private String localAuthorityCertificateProof;

    @Column(columnDefinition = "TEXT")
    private String divorceProof;

    @Column(columnDefinition = "TEXT")
    private String previousPartnerDeathProof;

    @Column(columnDefinition = "TEXT")
    private String judgeAuthorizationProof;

    @Column(columnDefinition = "TEXT")
    private String photosProof;

    @Column(columnDefinition = "TEXT")
    private String notes;

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
