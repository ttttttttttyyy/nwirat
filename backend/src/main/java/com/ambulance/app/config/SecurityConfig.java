package com.ambulance.app.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final UserDetailsService userDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/error").permitAll()
                .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/requests/my", "/api/requests/driver/my", "/api/authorizations/my", "/api/legalisation/my", "/api/administrative-attestations/my", "/api/civil-status/my").authenticated()
                .requestMatchers(org.springframework.http.HttpMethod.PATCH, "/api/requests/driver/*/complete").hasAnyAuthority("ROLE_DRIVER", "ROLE_AGENT", "ROLE_ADMIN")
                .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/requests", "/api/requests/**").hasAnyAuthority("ROLE_AGENT", "ROLE_ADMIN")
                .requestMatchers(org.springframework.http.HttpMethod.PATCH, "/api/requests", "/api/requests/**").hasAnyAuthority("ROLE_AGENT", "ROLE_ADMIN")
                .requestMatchers(org.springframework.http.HttpMethod.DELETE, "/api/requests", "/api/requests/**").hasAuthority("ROLE_ADMIN")
                .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/authorizations", "/api/authorizations/**").hasAnyAuthority("ROLE_AGENT", "ROLE_ADMIN")
                .requestMatchers(org.springframework.http.HttpMethod.PATCH, "/api/authorizations", "/api/authorizations/**").hasAnyAuthority("ROLE_AGENT", "ROLE_ADMIN")
                .requestMatchers(org.springframework.http.HttpMethod.DELETE, "/api/authorizations", "/api/authorizations/**").hasAuthority("ROLE_ADMIN")
                .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/legalisation", "/api/legalisation/**").hasAnyAuthority("ROLE_AGENT", "ROLE_ADMIN")
                .requestMatchers(org.springframework.http.HttpMethod.PATCH, "/api/legalisation", "/api/legalisation/**").hasAnyAuthority("ROLE_AGENT", "ROLE_ADMIN")
                .requestMatchers(org.springframework.http.HttpMethod.DELETE, "/api/legalisation", "/api/legalisation/**").hasAuthority("ROLE_ADMIN")
                .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/administrative-attestations", "/api/administrative-attestations/**").hasAnyAuthority("ROLE_AGENT", "ROLE_ADMIN")
                .requestMatchers(org.springframework.http.HttpMethod.PATCH, "/api/administrative-attestations", "/api/administrative-attestations/**").hasAnyAuthority("ROLE_AGENT", "ROLE_ADMIN")
                .requestMatchers(org.springframework.http.HttpMethod.DELETE, "/api/administrative-attestations", "/api/administrative-attestations/**").hasAuthority("ROLE_ADMIN")
                .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/civil-status", "/api/civil-status/**").hasAnyAuthority("ROLE_AGENT", "ROLE_ADMIN")
                .requestMatchers(org.springframework.http.HttpMethod.PATCH, "/api/civil-status", "/api/civil-status/**").hasAnyAuthority("ROLE_AGENT", "ROLE_ADMIN")
                .requestMatchers(org.springframework.http.HttpMethod.DELETE, "/api/civil-status", "/api/civil-status/**").hasAuthority("ROLE_ADMIN")
                .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/admin/users").hasAnyAuthority("ROLE_AGENT", "ROLE_ADMIN")
                .requestMatchers(org.springframework.http.HttpMethod.PATCH, "/api/admin/users/*/ban").hasAnyAuthority("ROLE_AGENT", "ROLE_ADMIN")
                .requestMatchers("/api/admin/**").hasAuthority("ROLE_ADMIN")
                .requestMatchers("/api/drivers/**", "/api/vehicles/**").hasAnyAuthority("ROLE_AGENT", "ROLE_ADMIN")
                .anyRequest().authenticated()
            )
            .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
