package com.stillum.registry.dto.response;

import com.stillum.registry.entity.Environment;
import java.util.UUID;

public record EnvironmentResponse(
        UUID id,
        UUID tenantId,
        String name,
        String description
) {
    public static EnvironmentResponse from(Environment e) {
        return new EnvironmentResponse(e.id, e.tenantId, e.name, e.description);
    }
}
