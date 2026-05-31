package com.ambulance.app.admin.dto;

import lombok.Data;

import java.util.List;

@Data
public class AdminAccessRequest {
    private String email;
    private List<String> permissions;
}
