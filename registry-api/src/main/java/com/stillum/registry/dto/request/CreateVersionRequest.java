package com.stillum.registry.dto.request;

import jakarta.validation.constraints.NotBlank;
import java.util.Map;

public record CreateVersionRequest(
        @NotBlank String version,
        String payloadRef,
        String metadata,
        String sourceCode,
        Map<String, String> npmDependencies,
        String npmPackageRef
) {
}
