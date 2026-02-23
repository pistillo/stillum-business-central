package com.stillum.registry.dto.request;

import jakarta.validation.constraints.NotBlank;

public record UpdatePayloadRefRequest(
        @NotBlank String payloadRef
) {
}
