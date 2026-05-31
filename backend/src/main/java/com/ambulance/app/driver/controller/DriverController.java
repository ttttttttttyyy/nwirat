package com.ambulance.app.driver.controller;

import com.ambulance.app.driver.entity.Driver;
import com.ambulance.app.driver.repository.DriverRepository;
import com.ambulance.app.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/drivers")
@RequiredArgsConstructor
public class DriverController {

    private final DriverRepository driverRepository;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<Driver>> getDrivers() {
        return ResponseEntity.ok(driverRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Driver> addDriver(@RequestBody Driver driver) {
        syncDriverUserRole(driver);
        return ResponseEntity.ok(driverRepository.save(driver));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Driver> updateDriver(@PathVariable Long id, @RequestBody Driver driver) {
        Driver existing = driverRepository.findById(id).orElseThrow(() -> new RuntimeException("Driver not found"));
        existing.setName(driver.getName());
        existing.setEmail(driver.getEmail());
        existing.setPhone(driver.getPhone());
        existing.setCin(driver.getCin());
        existing.setLicenseNumber(driver.getLicenseNumber());
        existing.setAvailable(driver.isAvailable());
        existing.setStatus(driver.getStatus());
        syncDriverUserRole(existing);
        return ResponseEntity.ok(driverRepository.save(existing));
    }

    private void syncDriverUserRole(Driver driver) {
        if (driver.getEmail() == null || driver.getEmail().trim().isEmpty()) {
            return;
        }
        userRepository.findByEmail(driver.getEmail().trim()).ifPresent(user -> {
            user.setRole("ROLE_DRIVER");
            user.setServicePermissions("DRIVER");
            user.setBanned(false);
            userRepository.save(user);
        });
    }
}
