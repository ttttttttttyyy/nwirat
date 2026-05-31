package com.ambulance.app.civilstatus.service;

import com.ambulance.app.civilstatus.entity.CivilStatusRequest;
import com.ambulance.app.civilstatus.repository.CivilStatusRequestRepository;
import com.ambulance.app.user.entity.User;
import com.ambulance.app.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class CivilStatusRequestService {

    private final CivilStatusRequestRepository requestRepository;
    private final UserRepository userRepository;

    private static final Set<String> ALLOWED_TYPES = Set.of(
            "death_declaration",
            "birth_declaration",
            "engagement_certificate",
            "family_booklet"
    );

    public List<CivilStatusRequest> getAllRequests() {
        return requestRepository.findAll();
    }

    public List<CivilStatusRequest> getRequestsByStatus(String status) {
        return requestRepository.findByStatus(status);
    }

    public CivilStatusRequest createRequest(CivilStatusRequest request) {
        String requestType = normalize(request.getRequestType());
        if (!ALLOWED_TYPES.contains(requestType)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid civil status request type");
        }

        request.setRequestType(requestType);
        request.setFeeAmount("family_booklet".equals(requestType) ? 50 : 0);
        request.setRequestTime(LocalDateTime.now());
        if (request.getStatus() == null) {
            request.setStatus("PENDING");
        }

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        userRepository.findByEmail(username).ifPresent(request::setUser);

        return requestRepository.save(request);
    }

    public CivilStatusRequest updateRequestStatus(Long id, String status, String reason) {
        CivilStatusRequest req = requestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Civil status request not found"));
        req.setStatus(status);
        if (reason != null && !reason.trim().isEmpty()) {
            req.setRejectionReason(reason);
        }
        return requestRepository.save(req);
    }

    public List<CivilStatusRequest> getMyRequests(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return requestRepository.findByUserIdOrderByRequestTimeDesc(user.getId());
    }

    public void deleteRequest(Long id) {
        requestRepository.deleteById(id);
    }

    private String normalize(String value) {
        if (value == null) {
            return "";
        }
        return value.trim().toLowerCase(Locale.ROOT);
    }
}
