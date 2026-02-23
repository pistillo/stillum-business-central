package com.stillum.registry.storage;

import java.util.UUID;

public final class StoragePathBuilder {

    private StoragePathBuilder() {
        // utility class
    }

    /**
     * Percorso oggetto per i payload degli artefatti:
     * tenant-{tenantId}/artifacts/{type}/{artifactId}/{versionId}.{ext}
     */
    public static String artifactKey(
            UUID tenantId, String type, UUID artifactId, UUID versionId, String extension) {
        return String.format("tenant-%s/artifacts/%s/%s/%s.%s",
                tenantId, type.toLowerCase(), artifactId, versionId, extension);
    }

    /**
     * Percorso oggetto per i bundle di pubblicazione:
     * tenant-{tenantId}/bundles/{type}/{artifactId}/{versionId}.zip
     */
    public static String bundleKey(
            UUID tenantId, String type, UUID artifactId, UUID versionId) {
        return String.format("tenant-%s/bundles/%s/%s/%s.zip",
                tenantId, type.toLowerCase(), artifactId, versionId);
    }

    /**
     * Estensione file in base al tipo di artefatto.
     */
    public static String extensionFor(String artifactType) {
        return switch (artifactType.toUpperCase()) {
            case "PROCESS", "RULE" -> "xml";
            case "FORM", "REQUEST" -> "json";
            default -> "bin";
        };
    }
}
