package com.stillum.registry.dto;

import jakarta.validation.constraints.NotBlank;

public class CreateVersionRequest {
    
    @NotBlank(message = "Version is required")
    public String version;

    public String payloadRef;

    public String metadata;
}
