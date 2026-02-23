package com.stillum.publisher.dto.request;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record PublishRequest(
        @NotNull UUID artifactId,
        @NotNull UUID versionId,
        @NotNull UUID environmentId,
        String notes
) {
}

