package com.stillum.registry.dto.request;

import com.stillum.registry.entity.enums.ArtifactType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record CreateArtifactRequest(
        @NotNull ArtifactType type,
        @NotBlank String title,
        String description,
        String area,
        List<String> tags
) {
}
