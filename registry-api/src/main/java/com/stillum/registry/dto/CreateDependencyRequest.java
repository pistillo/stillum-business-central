package com.stillum.registry.dto;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public class CreateDependencyRequest {
    
    @NotNull(message = "Depends on artifact ID is required")
    public UUID dependsOnArtifactId;

    public UUID dependsOnVersionId;
}
