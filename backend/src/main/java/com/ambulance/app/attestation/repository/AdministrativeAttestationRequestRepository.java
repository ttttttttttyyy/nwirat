package com.ambulance.app.attestation.repository;

import com.ambulance.app.attestation.entity.AdministrativeAttestationRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdministrativeAttestationRequestRepository extends JpaRepository<AdministrativeAttestationRequest, Long> {
    List<AdministrativeAttestationRequest> findByStatus(String status);
    List<AdministrativeAttestationRequest> findByUserIdOrderByRequestTimeDesc(Long userId);
}
