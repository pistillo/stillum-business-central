package com.stillum.registry.dto.response;

public record PresignedUrlResponse(
        String url,
        String objectKey,
        long expiresInSeconds
) {
}
