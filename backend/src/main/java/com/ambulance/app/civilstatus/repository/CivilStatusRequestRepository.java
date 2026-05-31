package com.ambulance.app.civilstatus.repository;

import com.ambulance.app.civilstatus.entity.CivilStatusRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CivilStatusRequestRepository extends JpaRepository<CivilStatusRequest, Long> {
    List<CivilStatusRequest> findByStatus(String status);
    List<CivilStatusRequest> findByUserIdOrderByRequestTimeDesc(Long userId);
}
