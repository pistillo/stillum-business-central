package com.stillum.registry.dto;

import com.stillum.registry.entity.enums.ArtifactStatus;
import com.stillum.registry.entity.enums.ArtifactType;

public class SearchRequest {
    
    public String query;

    public ArtifactType type;

    public ArtifactStatus status;

    public String tag;

    public String area;

    public int page = 0;

    public int size = 20;
}
