package com.stillum.registry.dto;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public class PublishRequest {
    
    @NotNull(message = "Artifact ID is required")
    public UUID artifactId;

    @NotNull(message = "Version ID is required")
    public UUID versionId;

    @NotNull(message = "Environment ID is required")
    public UUID environmentId;

    public String notes;

    public String releaseNotes;
}
