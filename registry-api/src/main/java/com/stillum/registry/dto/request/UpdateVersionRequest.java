package com.stillum.registry.dto.request;

public record UpdateVersionRequest(
        String payloadRef,
        String metadata
) {
}
