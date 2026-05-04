package com.ambulance.app.request.repository;

import com.ambulance.app.request.entity.AmbulanceRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AmbulanceRequestRepository extends JpaRepository<AmbulanceRequest, Long> {
    List<AmbulanceRequest> findByStatus(String status);
    List<AmbulanceRequest> findByUserIdOrderByRequestTimeDesc(Long userId);
}
