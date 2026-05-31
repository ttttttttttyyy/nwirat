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

    @PatchMapping("/{id}/assign")
    public ResponseEntity<AmbulanceRequest> assignMission(@PathVariable Long id, @RequestParam Long driverId, @RequestParam Long vehicleId) {
        return ResponseEntity.ok(requestService.assignMission(id, driverId, vehicleId));
    }

    @GetMapping("/driver/my")
    public ResponseEntity<List<AmbulanceRequest>> getDriverMissions() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(requestService.getDriverMissions(username));
    }

    @PatchMapping("/driver/{id}/complete")
    public ResponseEntity<AmbulanceRequest> completeDriverMission(@PathVariable Long id) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(requestService.completeDriverMission(id, username));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRequest(@PathVariable Long id) {
        requestService.deleteRequest(id);
        return ResponseEntity.noContent().build();
    }
}
