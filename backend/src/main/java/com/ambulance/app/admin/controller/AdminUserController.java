package com.ambulance.app.admin.controller;

import com.ambulance.app.admin.dto.AdminAccessRequest;
import com.ambulance.app.driver.entity.Driver;
import com.ambulance.app.driver.repository.DriverRepository;
import com.ambulance.app.user.entity.User;
import com.ambulance.app.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final UserRepository userRepository;
    private final DriverRepository driverRepository;

    @GetMapping
    public ResponseEntity<List<User>> getUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PatchMapping("/{id}/ban")
    public ResponseEntity<User> setBanned(@PathVariable Long id, @RequestParam boolean banned) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setBanned(banned);
        return ResponseEntity.ok(userRepository.save(user));
    }

    @PostMapping("/admin-access")
    public ResponseEntity<User> grantAdminAccess(@RequestBody AdminAccessRequest request) {
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow(() -> new RuntimeException("User not found"));
        if (!"ROLE_ADMIN".equals(user.getRole())) {
            user.setRole("ROLE_AGENT");
        }
        user.setServicePermissions(String.join(",", request.getPermissions() == null ? List.of() : request.getPermissions()));
        return ResponseEntity.ok(userRepository.save(user));
    }

    @PostMapping("/driver-role")
    public ResponseEntity<User> grantDriverRole(@RequestBody AdminAccessRequest request) {
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow(() -> new RuntimeException("User not found"));
        user.setRole("ROLE_DRIVER");
        user.setServicePermissions("DRIVER");
        User saved = userRepository.save(user);
        driverRepository.findByEmail(user.getEmail()).orElseGet(() -> driverRepository.save(Driver.builder()
                .name(user.getName())
                .email(user.getEmail())
                .cin(user.getCin())
                .status("AVAILABLE")
                .available(true)
                .build()));
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/remove-admin")
    public ResponseEntity<User> removeAdminRole(@RequestBody AdminAccessRequest request) {
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow(() -> new RuntimeException("User not found"));
        user.setRole("ROLE_USER");
        user.setServicePermissions("");
        return ResponseEntity.ok(userRepository.save(user));
    }

    @PostMapping("/remove-driver")
    public ResponseEntity<User> removeDriverRole(@RequestBody AdminAccessRequest request) {
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow(() -> new RuntimeException("User not found"));
        user.setRole("ROLE_USER");
        user.setServicePermissions("");
        driverRepository.findByEmail(user.getEmail()).ifPresent(driverRepository::delete);
        return ResponseEntity.ok(userRepository.save(user));
    }
}
