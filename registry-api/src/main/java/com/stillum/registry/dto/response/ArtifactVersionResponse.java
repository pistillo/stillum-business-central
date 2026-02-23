package com.stillum.registry.dto.response;

import com.stillum.registry.entity.ArtifactVersion;
import com.stillum.registry.entity.enums.VersionState;
import java.time.OffsetDateTime;
import java.util.UUID;

public record ArtifactVersionResponse(
        UUID id,
        UUID artifactId,
        String version,
        VersionState state,
        String payloadRef,
        UUID createdBy,
        OffsetDateTime createdAt,
        String metadata
) {

    public static ArtifactVersionResponse from(ArtifactVersion v) {
        return new ArtifactVersionResponse(
                v.id,
                v.artifactId,
                v.version,
                v.state,
                v.payloadRef,
                v.createdBy,
                v.createdAt,
                v.metadata
        );
    }
}
