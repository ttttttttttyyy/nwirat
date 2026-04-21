package com.ambulance.app.legalisation.repository;

import com.ambulance.app.legalisation.entity.LegalisationRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LegalisationRequestRepository extends JpaRepository<LegalisationRequest, Long> {
    List<LegalisationRequest> findByStatus(String status);
    List<LegalisationRequest> findByUserIdOrderByRequestTimeDesc(Long userId);
}
