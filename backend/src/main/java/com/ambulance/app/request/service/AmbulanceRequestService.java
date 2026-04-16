package com.ambulance.app.request.service;

import com.ambulance.app.request.entity.AmbulanceRequest;
import com.ambulance.app.request.repository.AmbulanceRequestRepository;
import com.ambulance.app.user.repository.UserRepository;
import com.ambulance.app.user.entity.User;
import org.springframework.security.core.context.SecurityContextHolder;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AmbulanceRequestService {

    private final AmbulanceRequestRepository requestRepository;
    private final UserRepository userRepository;

    public List<AmbulanceRequest> getAllRequests() {
        return requestRepository.findAll();
    }

    public List<AmbulanceRequest> getRequestsByStatus(String status) {
        return requestRepository.findByStatus(status);
    }

    public AmbulanceRequest createRequest(AmbulanceRequest request) {
        request.setRequestTime(LocalDateTime.now());
        if (request.getStatus() == null) {
            request.setStatus("PENDING");
        }
        
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        userRepository.findByEmail(username).ifPresent(request::setUser);

        return requestRepository.save(request);
    }

    public AmbulanceRequest updateRequestStatus(Long id, String status, String reason) {
        AmbulanceRequest req = requestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        req.setStatus(status);
        if (reason != null && !reason.trim().isEmpty()) {
            req.setRejectionReason(reason);
        }
        return requestRepository.save(req);
    }

    public List<AmbulanceRequest> getMyRequests(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return requestRepository.findByUserIdOrderByRequestTimeDesc(user.getId());
    }

    public void deleteRequest(Long id) {
        requestRepository.deleteById(id);
    }
}
