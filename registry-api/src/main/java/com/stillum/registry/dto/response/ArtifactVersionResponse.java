package com.stillum.registry.dto.response;

import com.stillum.registry.entity.ArtifactVersion;
import com.stillum.registry.entity.enums.VersionState;
import java.time.OffsetDateTime;
import java.util.Map;
import java.util.UUID;

public record ArtifactVersionResponse(
        UUID id,
        UUID artifactId,
        String version,
        VersionState state,
        UUID createdBy,
        OffsetDateTime createdAt,
        String metadata,
        String npmPackageRef,
        Map<String, String> files
) {

    /**
     * Build response from entity + files loaded from MinIO.
     */
    public static ArtifactVersionResponse from(ArtifactVersion v, Map<String, String> files) {
        return new ArtifactVersionResponse(
                v.id,
                v.artifactId,
                v.version,
                v.state,
                v.createdBy,
                v.createdAt,
                v.metadata,
                v.npmPackageRef,
                files
        );
    }
}
