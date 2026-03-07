package com.stillum.registry.dto.request;

import jakarta.validation.constraints.NotBlank;
import java.util.Map;

public record CreateVersionRequest(
        @NotBlank String version,
        String metadata,
        String npmPackageRef,
        Map<String, String> files
) {
}
