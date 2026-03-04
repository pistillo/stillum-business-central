package com.stillum.registry.dto.request;

import com.stillum.registry.entity.enums.ComponentType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

public record CreateComponentRequest(
        @NotBlank String title,
        String description,
        @NotNull ComponentType componentType,
        List<String> tags,
        @NotNull UUID parentModuleId
) {
}
