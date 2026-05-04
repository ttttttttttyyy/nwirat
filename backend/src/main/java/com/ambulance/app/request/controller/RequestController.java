package com.ambulance.app.request.controller;

import com.ambulance.app.request.entity.AmbulanceRequest;
import com.ambulance.app.request.service.AmbulanceRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
@RequiredArgsConstructor
public class RequestController {

    private final AmbulanceRequestService requestService;

    @GetMapping
    public ResponseEntity<List<AmbulanceRequest>> getAllRequests() {
        return ResponseEntity.ok(requestService.getAllRequests());
    }

    @GetMapping("/my")
    public ResponseEntity<List<AmbulanceRequest>> getMyRequests() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(requestService.getMyRequests(username));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<AmbulanceRequest>> getByStatus(@PathVariable String status) {
        return ResponseEntity.ok(requestService.getRequestsByStatus(status));
    }

    @PostMapping
    public ResponseEntity<AmbulanceRequest> createRequest(@RequestBody AmbulanceRequest request) {
        return ResponseEntity.ok(requestService.createRequest(request));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<AmbulanceRequest> updateStatus(@PathVariable Long id, @RequestParam String status, @RequestParam(required = false) String reason) {
        return ResponseEntity.ok(requestService.updateRequestStatus(id, status, reason));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRequest(@PathVariable Long id) {
        requestService.deleteRequest(id);
        return ResponseEntity.noContent().build();
    }
}
