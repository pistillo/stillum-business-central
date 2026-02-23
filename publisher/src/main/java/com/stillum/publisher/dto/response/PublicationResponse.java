package com.stillum.publisher.dto.response;

import java.time.OffsetDateTime;
import java.util.UUID;

public record PublicationResponse(
        UUID id,
        UUID tenantId,
        UUID artifactId,
        UUID versionId,
        UUID environmentId,
        OffsetDateTime publishedAt,
        String bundleRef,
        String notes
) {
}

