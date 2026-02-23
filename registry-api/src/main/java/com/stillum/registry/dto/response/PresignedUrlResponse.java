package com.stillum.registry.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

public record PresignedUrlResponse(
        String url,
        String objectKey,
        long expiresInSeconds
) {

    @JsonProperty("key")
    public String key() {
        return objectKey;
    }
}
