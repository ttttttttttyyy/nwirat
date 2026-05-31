package com.ambulance.app.attestation.service;

import com.ambulance.app.attestation.entity.AdministrativeAttestationRequest;
import com.ambulance.app.attestation.repository.AdministrativeAttestationRequestRepository;
import com.ambulance.app.user.entity.User;
import com.ambulance.app.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdministrativeAttestationRequestService {

    private final AdministrativeAttestationRequestRepository requestRepository;
    private final UserRepository userRepository;

    public List<AdministrativeAttestationRequest> getAllRequests() {
        return requestRepository.findAll();
    }

    public List<AdministrativeAttestationRequest> getRequestsByStatus(String status) {
        return requestRepository.findByStatus(status);
    }

    public AdministrativeAttestationRequest createRequest(AdministrativeAttestationRequest request) {
        request.setRequestTime(LocalDateTime.now());
        if (request.getStatus() == null) {
            request.setStatus("PENDING");
        }

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        userRepository.findByEmail(username).ifPresent(request::setUser);

        return requestRepository.save(request);
    }

    public AdministrativeAttestationRequest updateRequestStatus(Long id, String status, String reason) {
        AdministrativeAttestationRequest req = requestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Administrative attestation request not found"));
        req.setStatus(status);
        if (reason != null && !reason.trim().isEmpty()) {
            req.setRejectionReason(reason);
        }
        return requestRepository.save(req);
    }

    public List<AdministrativeAttestationRequest> getMyRequests(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return requestRepository.findByUserIdOrderByRequestTimeDesc(user.getId());
    }

    public void deleteRequest(Long id) {
        requestRepository.deleteById(id);
    }
}
