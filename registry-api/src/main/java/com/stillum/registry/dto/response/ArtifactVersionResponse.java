package com.stillum.registry.dto.response;

import com.stillum.registry.entity.ArtifactVersion;
import com.stillum.registry.entity.BuildSnapshot;
import com.stillum.registry.entity.enums.VersionState;
import com.stillum.registry.storage.SourceBundle;
import java.time.OffsetDateTime;
import java.util.Map;
import java.util.UUID;

public record ArtifactVersionResponse(
        UUID id,
        UUID artifactId,
        String version,
        VersionState state,
        String payloadRef,
        UUID createdBy,
        OffsetDateTime createdAt,
        String metadata,
        String sourceCode,
        Map<String, String> npmDependencies,
        String npmPackageRef,
        BuildSnapshot buildSnapshot,
        Map<String, String> sourceFiles
) {

    /**
     * Build response from entity + source data loaded from MinIO.
     */
    public static ArtifactVersionResponse from(ArtifactVersion v, SourceBundle source) {
        return new ArtifactVersionResponse(
                v.id,
                v.artifactId,
                v.version,
                v.state,
                v.payloadRef,
                v.createdBy,
                v.createdAt,
                v.metadata,
                source != null ? source.sourceCode() : null,
                v.npmDependencies,
                v.npmPackageRef,
                source != null ? source.buildSnapshot() : null,
                source != null ? source.sourceFiles() : null
        );
    }

    /**
     * Legacy: build response from entity only (reads inline DB columns).
     * Used by the data migrator to read old data before migration.
     */
    public static ArtifactVersionResponse from(ArtifactVersion v) {
        return new ArtifactVersionResponse(
                v.id,
                v.artifactId,
                v.version,
                v.state,
                v.payloadRef,
                v.createdBy,
                v.createdAt,
                v.metadata,
                v.sourceCode,
                v.npmDependencies,
                v.npmPackageRef,
                v.buildSnapshot,
                v.sourceFiles
        );
    }
}
