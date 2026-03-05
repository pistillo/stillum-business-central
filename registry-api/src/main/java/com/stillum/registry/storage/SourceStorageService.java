package com.stillum.registry.storage;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.stillum.registry.entity.BuildSnapshot;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.util.Map;
import java.util.UUID;

/**
 * Manages source-code storage in MinIO (S3).
 * Each artifact version's source data (sourceCode, sourceFiles, buildSnapshot)
 * is serialised as a single JSON object and stored at:
 *   tenant-{tenantId}/sources/{artifactId}/{versionId}.json
 */
@ApplicationScoped
public class SourceStorageService {

    @Inject
    S3StorageClient s3;

    @Inject
    ObjectMapper objectMapper;

    /**
     * Persist the source bundle to MinIO and return the S3 object key.
     * If the bundle is empty, nothing is uploaded and null is returned.
     */
    public String save(
            UUID tenantId,
            UUID artifactId,
            UUID versionId,
            String sourceCode,
            Map<String, String> sourceFiles,
            BuildSnapshot buildSnapshot) {

        SourceBundle bundle = new SourceBundle(sourceCode, sourceFiles, buildSnapshot);
        if (bundle.isEmpty()) {
            return null;
        }

        String key = StoragePathBuilder.sourceKey(tenantId, artifactId, versionId);
        try {
            byte[] json = objectMapper.writeValueAsBytes(bundle);
            s3.uploadBytes(s3.getArtifactsBucket(), key, json, "application/json");
            return key;
        } catch (Exception e) {
            throw new RuntimeException("Failed to save source bundle to MinIO: " + key, e);
        }
    }

    /**
     * Load the source bundle from MinIO.
     * Returns {@link SourceBundle#EMPTY} if sourceRef is null.
     */
    public SourceBundle load(String sourceRef) {
        if (sourceRef == null || sourceRef.isBlank()) {
            return SourceBundle.EMPTY;
        }

        try {
            byte[] data = s3.downloadBytes(s3.getArtifactsBucket(), sourceRef);
            return objectMapper.readValue(data, SourceBundle.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to load source bundle from MinIO: " + sourceRef, e);
        }
    }
}
