package com.stillum.registry.dto;

import com.stillum.registry.entity.enums.VersionState;
import jakarta.validation.constraints.NotNull;

public class TransitionRequest {
    
    @NotNull(message = "Target state is required")
    public VersionState targetState;
}
