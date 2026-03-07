package com.stillum.registry.storage;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Manages individual file storage in MinIO (S3).
 * Each file of an artifact version is stored as a separate S3 object under:
 *   tenant-{tenantId}/{type}/{artifactId}/{versionId}/{filePath}
 */
@ApplicationScoped
public class FileStorageService {

    @Inject
    S3StorageClient s3;

    /** Save a map of files (path -> content) as individual S3 objects. */
    public void saveFiles(UUID tenantId, String type,
            UUID artifactId, UUID versionId, Map<String, String> files) {
        for (var entry : files.entrySet()) {
            saveFile(tenantId, type, artifactId, versionId,
                    entry.getKey(), entry.getValue());
        }
    }

    /** Save a single file as an S3 object. */
    public void saveFile(UUID tenantId, String type,
            UUID artifactId, UUID versionId, String filePath, String content) {
        String key = StoragePathBuilder.fileKey(tenantId, type,
                artifactId, versionId, filePath);
        s3.uploadBytes(s3.getArtifactsBucket(), key,
                content.getBytes(StandardCharsets.UTF_8), contentTypeFor(filePath));
    }

    /** Load all files of a version (S3 listObjects + download). */
    public Map<String, String> loadFiles(UUID tenantId, String type,
            UUID artifactId, UUID versionId) {
        String prefix = StoragePathBuilder.versionPrefix(tenantId, type,
                artifactId, versionId);
        List<String> keys = s3.listKeys(s3.getArtifactsBucket(), prefix);
        Map<String, String> files = new LinkedHashMap<>();
        for (String key : keys) {
            String filePath = key.substring(prefix.length());
            byte[] data = s3.downloadBytes(s3.getArtifactsBucket(), key);
            files.put(filePath, new String(data, StandardCharsets.UTF_8));
        }
        return files;
    }

    /** Load a single file by path. */
    public String loadFile(UUID tenantId, String type,
            UUID artifactId, UUID versionId, String filePath) {
        String key = StoragePathBuilder.fileKey(tenantId, type,
                artifactId, versionId, filePath);
        byte[] data = s3.downloadBytes(s3.getArtifactsBucket(), key);
        return new String(data, StandardCharsets.UTF_8);
    }

    /** Check if a version has any files in S3. */
    public boolean hasFiles(UUID tenantId, String type,
            UUID artifactId, UUID versionId) {
        String prefix = StoragePathBuilder.versionPrefix(tenantId, type,
                artifactId, versionId);
        return !s3.listKeys(s3.getArtifactsBucket(), prefix).isEmpty();
    }

    private String contentTypeFor(String filePath) {
        String lower = filePath.toLowerCase();
        if (lower.endsWith(".json")) return "application/json";
        if (lower.endsWith(".xml") || lower.endsWith(".bpmn") || lower.endsWith(".dmn"))
            return "application/xml";
        if (lower.endsWith(".tsx") || lower.endsWith(".ts"))
            return "text/typescript";
        if (lower.endsWith(".js") || lower.endsWith(".mjs"))
            return "application/javascript";
        if (lower.endsWith(".css")) return "text/css";
        if (lower.endsWith(".html")) return "text/html";
        return "text/plain";
    }
}
