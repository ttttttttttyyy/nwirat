package com.ambulance.app.authorization.repository;

import com.ambulance.app.authorization.entity.AuthorizationRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuthorizationRequestRepository extends JpaRepository<AuthorizationRequest, Long> {
    List<AuthorizationRequest> findByUserIdOrderByRequestTimeDesc(Long userId);
    List<AuthorizationRequest> findByStatus(String status);
}
