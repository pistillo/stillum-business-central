package com.stillum.registry.dto.request;

import com.stillum.registry.entity.BuildSnapshot;
import java.util.Map;

public record UpdateVersionRequest(
        String payloadRef,
        String metadata,
        String sourceCode,
        Map<String, String> npmDependencies,
        String npmPackageRef,
        BuildSnapshot buildSnapshot
) {
}
