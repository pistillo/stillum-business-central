package com.stillum.registry.dto.response;

import com.stillum.registry.entity.Artifact;
import com.stillum.registry.entity.enums.ArtifactStatus;
import com.stillum.registry.entity.enums.ArtifactType;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public record ArtifactResponse(
        UUID id,
        UUID tenantId,
        ArtifactType type,
        String title,
        String description,
        UUID ownerId,
        ArtifactStatus status,
        String area,
        List<String> tags,
        UUID parentModuleId,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {

    public static ArtifactResponse from(Artifact a) {
        return new ArtifactResponse(
                a.id,
                a.tenantId,
                a.type,
                a.title,
                a.description,
                a.ownerId,
                a.status,
                a.area,
                a.tags != null ? List.of(a.tags) : List.of(),
                a.parentModuleId,
                a.createdAt,
                a.updatedAt
        );
    }
}
