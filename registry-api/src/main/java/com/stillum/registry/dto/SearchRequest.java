package com.stillum.registry.dto;

import com.stillum.registry.entity.enums.ArtifactStatus;
import com.stillum.registry.entity.enums.ArtifactType;

public class SearchRequest {
    public int page = 0;
    public int size = 20;
    public ArtifactType type;
    public ArtifactStatus status;
    public String area;
    public String query;
    public String tag;
}
