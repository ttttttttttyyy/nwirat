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
        userRepository.findByEmail("agent@gmail.com").ifPresentOrElse(existingUser -> {
            existingUser.setRole("ROLE_ADMIN");
            existingUser.setPassword(passwordEncoder.encode("password"));
            existingUser.setServicePermissions("DASHBOARD,USERS,ADMINS,FLEET,VEH,AUT,LEG,ATT,EC");
            existingUser.setBanned(false);
            userRepository.save(existingUser);
            System.out.println("Updated admin access for existing user: agent@gmail.com");
        }, () -> {
            User agent = User.builder()
                    .name("Agent User")
                    .email("agent@gmail.com")
                    .cin("AGENT001")
                    .age(30)
                    .password(passwordEncoder.encode("password"))
                    .role("ROLE_ADMIN")
                    .servicePermissions("DASHBOARD,USERS,ADMINS,FLEET,VEH,AUT,LEG,ATT,EC")
                    .build();
            userRepository.save(agent);
            System.out.println("Admin user created: agent@gmail.com / password");
        });
    }
}
