package com.stillum.registry.dto.request;

import jakarta.validation.constraints.NotBlank;

public record CreateEnvironmentRequest(
        @NotBlank String name,
        String description
) {
}
