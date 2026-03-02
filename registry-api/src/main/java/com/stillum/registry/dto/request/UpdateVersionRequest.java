package com.stillum.registry.dto.request;

import java.util.Map;

public record UpdateVersionRequest(
        String payloadRef,
        String metadata,
        String sourceCode,
        Map<String, String> npmDependencies,
        String npmPackageRef
) {
}
