package com.stillum.registry.dto;

import com.stillum.registry.entity.enums.ArtifactType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CreateArtifactRequest {
    
    @NotNull(message = "Type is required")
    public ArtifactType type;

    @NotBlank(message = "Title is required")
    public String title;

    public String description;

    public String tags;

    public String area;
}
