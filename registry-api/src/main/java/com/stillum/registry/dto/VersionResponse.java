package com.stillum.registry.dto;

import com.stillum.registry.entity.enums.VersionState;
import java.time.LocalDateTime;
import java.util.UUID;

public class VersionResponse {
    
    public UUID id;

    public UUID artifactId;

    public String version;

    public VersionState state;

    public String payloadRef;

    public UUID createdBy;

    public LocalDateTime createdAt;

    public String metadata;
}
