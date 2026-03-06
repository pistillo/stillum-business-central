package com.stillum.registry.storage;

import java.util.UUID;

public final class StoragePathBuilder {

    private StoragePathBuilder() {
        // utility class
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
     * Chiave per un singolo file dentro una versione:
     * tenant-{tenantId}/{type}/{artifactId}/{versionId}/{filePath}
     */
    public static String fileKey(UUID tenantId, String type,
            UUID artifactId, UUID versionId, String filePath) {
        return versionPrefix(tenantId, type, artifactId, versionId) + filePath;
    }

    /**
     * Nome file di default per i tipi non source-code-based:
     * PROCESS -> process.bpmn, RULE -> rule.dmn, FORM/REQUEST -> form.json
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
     * Estensione file del sorgente in base al tipo di artefatto.
     * Usato nei bundle di pubblicazione per i nomi dei file interni.
     */
    public static String extensionFor(String artifactType) {
        return switch (artifactType.toUpperCase()) {
            case "PROCESS", "RULE" -> "xml";
            case "FORM", "REQUEST" -> "json";
            case "MODULE", "COMPONENT" -> "tsx";
            default -> "bin";
        };
    }

    /**
     * Indica se il tipo di artefatto contiene codice sorgente (MODULE/COMPONENT)
     * salvato come file individuali in MinIO.
     */
    public static boolean isSourceCodeBased(String artifactType) {
        return "MODULE".equalsIgnoreCase(artifactType) || "COMPONENT".equalsIgnoreCase(artifactType);
    }
}
