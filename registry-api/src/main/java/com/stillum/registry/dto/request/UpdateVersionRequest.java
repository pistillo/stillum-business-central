package com.stillum.registry.dto.request;

import java.util.Map;

public record UpdateVersionRequest(
        String metadata,
        String npmPackageRef,
        Map<String, String> files
) {
}
