package com.ambulance.app.legalisation.service;

import com.ambulance.app.legalisation.entity.LegalisationRequest;
import com.ambulance.app.legalisation.repository.LegalisationRequestRepository;
import com.ambulance.app.user.repository.UserRepository;
import com.ambulance.app.user.entity.User;
import org.springframework.security.core.context.SecurityContextHolder;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LegalisationRequestService {

    private final LegalisationRequestRepository requestRepository;
    private final UserRepository userRepository;

    public List<LegalisationRequest> getAllRequests() {
        return requestRepository.findAll();
    }

    public List<LegalisationRequest> getRequestsByStatus(String status) {
        return requestRepository.findByStatus(status);
    }

    public LegalisationRequest createRequest(LegalisationRequest request) {
        request.setRequestTime(LocalDateTime.now());
        if (request.getStatus() == null) {
            request.setStatus("PENDING");
        }
        
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        userRepository.findByEmail(username).ifPresent(request::setUser);

        return requestRepository.save(request);
    }

    public LegalisationRequest updateRequestStatus(Long id, String status, String reason) {
        LegalisationRequest req = requestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Legalisation Request not found"));
        req.setStatus(status);
        if (reason != null && !reason.trim().isEmpty()) {
            req.setRejectionReason(reason);
        }
        return requestRepository.save(req);
    }

    public List<LegalisationRequest> getMyRequests(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return requestRepository.findByUserIdOrderByRequestTimeDesc(user.getId());
    }

    public void deleteRequest(Long id) {
        requestRepository.deleteById(id);
    }
}
