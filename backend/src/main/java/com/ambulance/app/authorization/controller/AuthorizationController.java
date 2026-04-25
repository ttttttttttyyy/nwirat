package com.ambulance.app.authorization.controller;

import com.ambulance.app.authorization.entity.AuthorizationRequest;
import com.ambulance.app.authorization.service.AuthorizationRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/authorizations")
@RequiredArgsConstructor
public class AuthorizationController {

    private final AuthorizationRequestService requestService;

    @GetMapping
    public ResponseEntity<List<AuthorizationRequest>> getAllRequests() {
        return ResponseEntity.ok(requestService.getAllRequests());
    }

    @GetMapping("/my")
    public ResponseEntity<List<AuthorizationRequest>> getMyRequests() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(requestService.getMyRequests(username));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<AuthorizationRequest>> getByStatus(@PathVariable String status) {
        return ResponseEntity.ok(requestService.getRequestsByStatus(status));
    }

    @PostMapping
    public ResponseEntity<AuthorizationRequest> createRequest(@RequestBody AuthorizationRequest request) {
        return ResponseEntity.ok(requestService.createRequest(request));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<AuthorizationRequest> updateStatus(@PathVariable Long id, @RequestParam String status, @RequestParam(required = false) String reason) {
        return ResponseEntity.ok(requestService.updateRequestStatus(id, status, reason));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRequest(@PathVariable Long id) {
        requestService.deleteRequest(id);
        return ResponseEntity.noContent().build();
    }
}
