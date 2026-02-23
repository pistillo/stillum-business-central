package com.stillum.registry.dto.request;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record AddDependencyRequest(
        @NotNull UUID dependsOnArtifactId,
        @NotNull UUID dependsOnVersionId
) {
}
