package com.stillum.registry.dto.response;

import com.stillum.registry.entity.Artifact;
import com.stillum.registry.entity.ArtifactVersion;
import com.stillum.registry.entity.enums.ArtifactStatus;
import com.stillum.registry.entity.enums.ArtifactType;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public record ArtifactDetailResponse(
        UUID id,
        UUID tenantId,
        ArtifactType type,
        String title,
        String description,
        UUID ownerId,
        ArtifactStatus status,
        String area,
        List<String> tags,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt,
        List<ArtifactVersionResponse> versions
) {
    public static ArtifactDetailResponse from(Artifact a, List<ArtifactVersion> versions) {
        return new ArtifactDetailResponse(
                a.id,
                a.tenantId,
                a.type,
                a.title,
                a.description,
                a.ownerId,
                a.status,
                a.area,
                a.tags != null ? List.of(a.tags) : List.of(),
                a.createdAt,
                a.updatedAt,
                versions.stream().map(ArtifactVersionResponse::from).toList()
        );
    }
}
