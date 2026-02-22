package com.stillum.registry.dto;

import java.util.UUID;

public class DependencyResponse {
    
    public UUID id;

    public UUID artifactVersionId;

    public UUID dependsOnArtifactId;

    public UUID dependsOnVersionId;
}
