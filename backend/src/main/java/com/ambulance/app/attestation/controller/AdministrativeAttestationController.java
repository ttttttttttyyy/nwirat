package com.ambulance.app.attestation.controller;

import com.ambulance.app.attestation.entity.AdministrativeAttestationRequest;
import com.ambulance.app.attestation.service.AdministrativeAttestationRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/administrative-attestations")
@RequiredArgsConstructor
public class AdministrativeAttestationController {

    private final AdministrativeAttestationRequestService requestService;

    @GetMapping
    public ResponseEntity<List<AdministrativeAttestationRequest>> getAllRequests() {
        return ResponseEntity.ok(requestService.getAllRequests());
    }

    @GetMapping("/my")
    public ResponseEntity<List<AdministrativeAttestationRequest>> getMyRequests() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(requestService.getMyRequests(username));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<AdministrativeAttestationRequest>> getByStatus(@PathVariable String status) {
        return ResponseEntity.ok(requestService.getRequestsByStatus(status));
    }

    @PostMapping
    public ResponseEntity<AdministrativeAttestationRequest> createRequest(@RequestBody AdministrativeAttestationRequest request) {
        return ResponseEntity.ok(requestService.createRequest(request));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<AdministrativeAttestationRequest> updateStatus(@PathVariable Long id, @RequestParam String status, @RequestParam(required = false) String reason) {
        return ResponseEntity.ok(requestService.updateRequestStatus(id, status, reason));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRequest(@PathVariable Long id) {
        requestService.deleteRequest(id);
        return ResponseEntity.noContent().build();
    }
}
