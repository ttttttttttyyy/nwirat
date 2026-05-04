package com.ambulance.app.config;

import com.ambulance.app.user.entity.User;
import com.ambulance.app.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.findByEmail("agent@gmail.com").isEmpty()) {
            User admin = User.builder()
                    .name("System Admin")
                    .email("agent@gmail.com")
                    .cin("ADMIN001")
                    .age(30)
                    .password(passwordEncoder.encode("password"))
                    .role("ROLE_ADMIN")
                    .build();
            userRepository.save(admin);
            System.out.println("Admin user created: agent@gmail.com / password");
        }
    }
}
