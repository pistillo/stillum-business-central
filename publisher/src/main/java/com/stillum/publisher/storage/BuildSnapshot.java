package com.stillum.publisher.storage;

import java.time.OffsetDateTime;
import java.util.Map;

public record BuildSnapshot(
        OffsetDateTime generatedAt,
        String templateVersion,
        Map<String, String> inputs,
        Map<String, String> files
) {
}
