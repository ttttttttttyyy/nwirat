package com.ambulance.app.auth.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String email;
    private String password;
    private String name;
    private Integer age;
    private String cin;
    private String role; // Optional: specify "AGENT" or "USER"
}
