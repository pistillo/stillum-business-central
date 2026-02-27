package com.stillum.registry.dto.request;

import jakarta.validation.constraints.NotBlank;

public record CreateVersionRequest(
        @NotBlank String version,
        String payloadRef,
        String metadata,
        String sourceCode,
        String npmDependencies,
        String npmPackageRef
) {
}
