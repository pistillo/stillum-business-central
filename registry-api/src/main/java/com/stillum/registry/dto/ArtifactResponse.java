package com.stillum.registry.dto;

import com.stillum.registry.entity.enums.ArtifactStatus;
import com.stillum.registry.entity.enums.ArtifactType;
import java.time.LocalDateTime;
import java.util.UUID;

public class ArtifactResponse {
    
    public UUID id;

    public UUID tenantId;

    public ArtifactType type;

    public String title;

    public String description;

    public UUID ownerId;

    public ArtifactStatus status;

    public String tags;

    public String area;

    public LocalDateTime createdAt;

    public LocalDateTime updatedAt;

    public boolean deleted;
}
