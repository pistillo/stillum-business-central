package com.stillum.publisher.storage;

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
}
