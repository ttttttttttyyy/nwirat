package com.ambulance.app.civilstatus.controller;

import com.ambulance.app.civilstatus.entity.CivilStatusRequest;
import com.ambulance.app.civilstatus.service.CivilStatusRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/civil-status")
@RequiredArgsConstructor
public class CivilStatusController {

    private final CivilStatusRequestService requestService;

    @GetMapping
    public ResponseEntity<List<CivilStatusRequest>> getAllRequests() {
        return ResponseEntity.ok(requestService.getAllRequests());
    }

    @GetMapping("/my")
    public ResponseEntity<List<CivilStatusRequest>> getMyRequests() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(requestService.getMyRequests(username));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<CivilStatusRequest>> getByStatus(@PathVariable String status) {
        return ResponseEntity.ok(requestService.getRequestsByStatus(status));
    }

    @PostMapping
    public ResponseEntity<CivilStatusRequest> createRequest(@RequestBody CivilStatusRequest request) {
        return ResponseEntity.ok(requestService.createRequest(request));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<CivilStatusRequest> updateStatus(@PathVariable Long id, @RequestParam String status, @RequestParam(required = false) String reason) {
        return ResponseEntity.ok(requestService.updateRequestStatus(id, status, reason));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRequest(@PathVariable Long id) {
        requestService.deleteRequest(id);
        return ResponseEntity.noContent().build();
    }
}
