package com.ambulance.app.auth.service;

import com.ambulance.app.auth.dto.LoginRequest;
import com.ambulance.app.auth.dto.RegisterRequest;
import com.ambulance.app.auth.dto.AuthResponse;
import com.ambulance.app.config.JwtUtil;
import com.ambulance.app.user.entity.User;
import com.ambulance.app.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email is already taken");
        }

        String assignedRole = "ROLE_USER";
        if (request.getRole() != null && !request.getRole().trim().isEmpty()) {
            assignedRole = request.getRole().startsWith("ROLE_") 
                ? request.getRole().toUpperCase() 
                : "ROLE_" + request.getRole().toUpperCase();
        }

        var user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .age(request.getAge())
                .cin(request.getCin())
                .role(assignedRole)
                .build();
        userRepository.save(user);

        java.util.Map<String, Object> extraClaims = new java.util.HashMap<>();
        extraClaims.put("role", user.getRole());
        extraClaims.put("name", user.getName());
        var jwtToken = jwtUtil.generateToken(extraClaims, user);
        return new AuthResponse(jwtToken);
    }

    public AuthResponse authenticate(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();

        java.util.Map<String, Object> extraClaims = new java.util.HashMap<>();
        extraClaims.put("role", user.getRole());
        extraClaims.put("name", user.getName());
        var jwtToken = jwtUtil.generateToken(extraClaims, user);
        return new AuthResponse(jwtToken);
    }
}
