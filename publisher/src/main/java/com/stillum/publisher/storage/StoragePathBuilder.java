package com.stillum.publisher.storage;

import java.util.UUID;

public final class StoragePathBuilder {

    private StoragePathBuilder() {
    }

    /**
     * Prefix per tutti i file di una versione:
     * tenant-{tenantId}/{type}/{artifactId}/{versionId}/
     */
    public static String versionPrefix(UUID tenantId, String type,
            UUID artifactId, UUID versionId) {
        return String.format("tenant-%s/%s/%s/%s/",
                tenantId, type.toLowerCase(), artifactId, versionId);
    }

    /**
     * Chiave per un singolo file dentro una versione.
     */
    public static String fileKey(UUID tenantId, String type,
            UUID artifactId, UUID versionId, String filePath) {
        return versionPrefix(tenantId, type, artifactId, versionId) + filePath;
    }

    /**
     * Nome file di default per i tipi non source-code-based.
     */
    public static String defaultFileName(String artifactType) {
        return switch (artifactType.toUpperCase()) {
            case "PROCESS" -> "process.bpmn";
            case "RULE" -> "rule.dmn";
            case "FORM" -> "form.json";
            case "REQUEST" -> "request.json";
            default -> "content.bin";
        };
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
            case "MODULE", "COMPONENT" -> "tsx";
            default -> "bin";
        };
    }

    public static boolean isSourceCodeBased(String artifactType) {
        return "MODULE".equalsIgnoreCase(artifactType) || "COMPONENT".equalsIgnoreCase(artifactType);
    }
}
