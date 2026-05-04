package com.ambulance.app.authorization.service;

import com.ambulance.app.authorization.entity.AuthorizationRequest;
import com.ambulance.app.authorization.repository.AuthorizationRequestRepository;
import com.ambulance.app.user.entity.User;
import com.ambulance.app.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthorizationRequestService {

    private final AuthorizationRequestRepository requestRepository;
    private final UserRepository userRepository;

    public List<AuthorizationRequest> getAllRequests() {
        return requestRepository.findAll();
    }

    public List<AuthorizationRequest> getRequestsByStatus(String status) {
        return requestRepository.findByStatus(status);
    }

    public AuthorizationRequest createRequest(AuthorizationRequest request) {
        request.setRequestTime(LocalDateTime.now());
        if (request.getStatus() == null) {
            request.setStatus("PENDING");
        }

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        userRepository.findByEmail(username).ifPresent(request::setUser);

        return requestRepository.save(request);
    }

    public AuthorizationRequest updateRequestStatus(Long id, String status, String reason) {
        AuthorizationRequest req = requestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Authorization Request not found"));
        req.setStatus(status);
        if (reason != null && !reason.trim().isEmpty()) {
            req.setRejectionReason(reason);
        }
        return requestRepository.save(req);
    }

    public List<AuthorizationRequest> getMyRequests(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return requestRepository.findByUserIdOrderByRequestTimeDesc(user.getId());
    }

    public void deleteRequest(Long id) {
        requestRepository.deleteById(id);
    }
}
