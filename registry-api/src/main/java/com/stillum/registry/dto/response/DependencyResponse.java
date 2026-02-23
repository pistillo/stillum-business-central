package com.stillum.registry.dto.response;

import com.stillum.registry.entity.Dependency;
import java.util.UUID;

public record DependencyResponse(
        UUID id,
        UUID artifactVersionId,
        UUID dependsOnArtifactId,
        UUID dependsOnVersionId
) {

    public static DependencyResponse from(Dependency d) {
        return new DependencyResponse(
                d.id,
                d.artifactVersionId,
                d.dependsOnArtifactId,
                d.dependsOnVersionId
        );
    }
}
