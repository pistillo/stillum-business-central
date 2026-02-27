package com.stillum.registry.dto.request;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public record CreateModuleRequest(
        @NotBlank String title,
        String description,
        String area,
        List<String> tags
) {
}
