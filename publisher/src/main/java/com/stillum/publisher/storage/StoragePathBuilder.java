package com.stillum.publisher.storage;

import java.util.UUID;

public final class StoragePathBuilder {

    private StoragePathBuilder() {
    }

    public static String bundleKey(
            UUID tenantId, String type, UUID artifactId, UUID versionId) {
        return String.format("tenant-%s/bundles/%s/%s/%s.zip",
                tenantId, type.toLowerCase(), artifactId, versionId);
    }

    public static String extensionFor(String artifactType) {
        return switch (artifactType.toUpperCase()) {
            case "PROCESS", "RULE" -> "xml";
            case "FORM", "REQUEST" -> "json";
            default -> "bin";
        };
    }
}

