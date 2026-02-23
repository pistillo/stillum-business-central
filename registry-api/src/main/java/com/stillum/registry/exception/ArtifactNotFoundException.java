package com.stillum.registry.exception;

import java.util.UUID;

public class ArtifactNotFoundException extends RuntimeException {

    public ArtifactNotFoundException(UUID artifactId) {
        super("Artifact not found: " + artifactId);
    }

    public ArtifactNotFoundException(UUID artifactId, UUID versionId) {
        super("Artifact version not found: artifactId=" + artifactId + ", versionId=" + versionId);
    }
}
