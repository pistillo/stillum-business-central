package com.stillum.registry.dto.request;

import jakarta.validation.constraints.NotBlank;

public record UpdateEnvironmentRequest(
        @NotBlank String name,
        String description
) {
}
