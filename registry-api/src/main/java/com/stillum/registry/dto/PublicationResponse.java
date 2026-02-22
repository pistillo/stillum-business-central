package com.stillum.registry.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class PublicationResponse {
    
    public UUID id;

    public UUID artifactVersionId;

    public UUID environmentId;

    public UUID publishedBy;

    public LocalDateTime publishedAt;

    public String notes;

    public String bundleRef;

    public String releaseNotes;
}
