package com.ambulance.app.request.service;

import com.ambulance.app.request.entity.AmbulanceRequest;
import com.ambulance.app.request.repository.AmbulanceRequestRepository;
import com.ambulance.app.user.repository.UserRepository;
import com.ambulance.app.user.entity.User;
import com.ambulance.app.driver.entity.Driver;
import com.ambulance.app.driver.repository.DriverRepository;
import com.ambulance.app.vehicle.entity.Vehicle;
import com.ambulance.app.vehicle.repository.VehicleRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AmbulanceRequestService {

    private final AmbulanceRequestRepository requestRepository;
    private final UserRepository userRepository;
    private final DriverRepository driverRepository;
    private final VehicleRepository vehicleRepository;

    private static final Map<String, Integer> DESTINATION_FEES = Map.of(
            "rabat", 180,
            "sale", 180,
            "kenitra", 120,
            "sidi_kacem", 90,
            "outside_region", 300
    );

    private static final Set<String> FREE_MEDICAL_REASONS = Set.of(
            "accident",
            "giving_birth",
            "mental_issues",
            "long_term_sickness"
    );

    private static final Set<String> ALLOWED_MEDICAL_REASONS = Set.of(
            "accident",
            "giving_birth",
            "mental_issues",
            "long_term_sickness",
            "other"
    );

    private static final Set<String> ALLOWED_SERVICE_AREAS = Set.of(
            "rabat",
            "sale",
            "kenitra",
            "sidi_kacem",
            "outside_region"
    );

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

        applyAmbulanceRules(request);
        
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

    public AmbulanceRequest assignMission(Long id, Long driverId, Long vehicleId) {
        AmbulanceRequest req = requestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found"));
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));

        req.setAssignedDriverId(driver.getId());
        req.setAssignedDriverName(driver.getName());
        req.setAssignedVehicleId(vehicle.getId());
        req.setAssignedVehiclePlate(vehicle.getPlateNumber());
        req.setStatus("ACCEPTED");

        driver.setStatus("ON_MISSION");
        driver.setAvailable(false);
        vehicle.setStatus("ON_MISSION");
        vehicle.setAvailable(false);
        driverRepository.save(driver);
        vehicleRepository.save(vehicle);
        return requestRepository.save(req);
    }

    public List<AmbulanceRequest> getDriverMissions(String email) {
        Driver driver = driverRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Driver not found"));
        return requestRepository.findAll().stream()
                .filter(req -> driver.getId().equals(req.getAssignedDriverId()))
                .toList();
    }

    private void applyAmbulanceRules(AmbulanceRequest request) {
        if (!"ambulance".equalsIgnoreCase(request.getVehicleType())) {
            request.setServiceArea(null);
            request.setMedicalReason(null);
            request.setFeeAmount(0);
            request.setFeeReason("No ambulance fee");
            return;
        }

        String serviceArea = normalize(request.getServiceArea());
        String medicalReason = normalize(request.getMedicalReason());

        if (!ALLOWED_SERVICE_AREAS.contains(serviceArea)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid ambulance destination area");
        }

        if (!ALLOWED_MEDICAL_REASONS.contains(medicalReason)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid medical reason");
        }

        request.setServiceArea(serviceArea);
        request.setMedicalReason(medicalReason);

        if (FREE_MEDICAL_REASONS.contains(medicalReason)) {
            request.setFeeAmount(0);
            request.setFeeReason("Medical exemption");
            return;
        }

        Integer fee = DESTINATION_FEES.get(serviceArea);
        request.setFeeAmount(fee);
        request.setFeeReason(serviceArea.equals("outside_region")
                ? "Outside the region fee, available only within 300 km of the requested hospital"
                : "Destination fee");
    }

    private String normalize(String value) {
        if (value == null) {
            return "";
        }
        return value.trim().toLowerCase(Locale.ROOT);
    }
}
