package com.stillum.registry.dto.response;

import java.util.List;

public record WorkspaceResponse(
        ArtifactResponse module,
        ArtifactVersionResponse moduleVersion,
        List<ComponentEntry> components
) {

    public record ComponentEntry(
            ArtifactResponse artifact,
            ArtifactVersionResponse version
    ) {
    }
}
