package com.stillum.registry.service;

import com.stillum.registry.dto.response.PresignedUrlResponse;
import com.stillum.registry.exception.ArtifactNotFoundException;
import com.stillum.registry.exception.ObjectAlreadyExistsException;
import com.stillum.registry.exception.ObjectNotFoundException;
import com.stillum.registry.filter.EnforceTenantRls;
import com.stillum.registry.repository.ArtifactRepository;
import com.stillum.registry.repository.ArtifactVersionRepository;
import com.stillum.registry.storage.S3StorageClient;
import com.stillum.registry.storage.StoragePathBuilder;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import java.util.UUID;
import org.eclipse.microprofile.config.inject.ConfigProperty;

@ApplicationScoped
@EnforceTenantRls
public class StorageService {

    @Inject
    S3StorageClient s3;

    @Inject
    ArtifactRepository artifactRepo;

    @Inject
    ArtifactVersionRepository versionRepo;

    @ConfigProperty(name = "stillum.storage.presigned-url-expiry-seconds")
    long expirySeconds;

    @Transactional
    public PresignedUrlResponse generateUploadUrl(
            UUID tenantId, UUID artifactId, UUID versionId, String contentType) {
        if (artifactId == null) {
            throw new IllegalArgumentException("artifactId is required");
        }
        if (versionId == null) {
            throw new IllegalArgumentException("versionId is required");
        }
        if (contentType == null || contentType.isBlank()) {
            throw new IllegalArgumentException("contentType is required");
        }
        var artifact = artifactRepo.findByIdAndTenant(artifactId, tenantId)
                .orElseThrow(() -> new ArtifactNotFoundException(artifactId));

        versionRepo.findByIdAndArtifact(versionId, artifactId)
                .orElseThrow(() -> new ArtifactNotFoundException(artifactId, versionId));

        String ext = StoragePathBuilder.extensionFor(artifact.type.name());
        String key = StoragePathBuilder.artifactKey(tenantId, artifact.type.name(),
                artifactId, versionId, ext);

        String url = s3.generateUploadPresignedUrl(s3.getArtifactsBucket(), key, contentType);
        return new PresignedUrlResponse(url, key, expirySeconds);
    }

    @Transactional
    public PresignedUrlResponse generateDownloadUrl(
            UUID tenantId, UUID artifactId, UUID versionId) {
        if (artifactId == null) {
            throw new IllegalArgumentException("artifactId is required");
        }
        if (versionId == null) {
            throw new IllegalArgumentException("versionId is required");
        }
        var artifact = artifactRepo.findByIdAndTenant(artifactId, tenantId)
                .orElseThrow(() -> new ArtifactNotFoundException(artifactId));

        var version = versionRepo.findByIdAndArtifact(versionId, artifactId)
                .orElseThrow(() -> new ArtifactNotFoundException(artifactId, versionId));

        if (version.payloadRef == null) {
            throw new IllegalArgumentException("Version " + versionId + " has no payload");
        }

        String url = s3.generateDownloadPresignedUrl(s3.getArtifactsBucket(), version.payloadRef);
        return new PresignedUrlResponse(url, version.payloadRef, expirySeconds);
    }

    @Transactional
    public PresignedUrlResponse generateBundleUploadUrl(
            UUID tenantId, UUID artifactId, UUID versionId, String contentType) {
        if (artifactId == null) {
            throw new IllegalArgumentException("artifactId is required");
        }
        if (versionId == null) {
            throw new IllegalArgumentException("versionId is required");
        }
        if (contentType == null || contentType.isBlank()) {
            throw new IllegalArgumentException("contentType is required");
        }
        var artifact = artifactRepo.findByIdAndTenant(artifactId, tenantId)
                .orElseThrow(() -> new ArtifactNotFoundException(artifactId));

        versionRepo.findByIdAndArtifact(versionId, artifactId)
                .orElseThrow(() -> new ArtifactNotFoundException(artifactId, versionId));

        String key = StoragePathBuilder.bundleKey(tenantId, artifact.type.name(), artifactId, versionId);

        if (s3.exists(s3.getBundlesBucket(), key)) {
            throw new ObjectAlreadyExistsException(key);
        }

        String url = s3.generateUploadPresignedUrl(s3.getBundlesBucket(), key, contentType);
        return new PresignedUrlResponse(url, key, expirySeconds);
    }

    @Transactional
    public PresignedUrlResponse generateBundleDownloadUrl(
            UUID tenantId, UUID artifactId, UUID versionId) {
        if (artifactId == null) {
            throw new IllegalArgumentException("artifactId is required");
        }
        if (versionId == null) {
            throw new IllegalArgumentException("versionId is required");
        }
        var artifact = artifactRepo.findByIdAndTenant(artifactId, tenantId)
                .orElseThrow(() -> new ArtifactNotFoundException(artifactId));

        versionRepo.findByIdAndArtifact(versionId, artifactId)
                .orElseThrow(() -> new ArtifactNotFoundException(artifactId, versionId));

        String key = StoragePathBuilder.bundleKey(tenantId, artifact.type.name(), artifactId, versionId);

        if (!s3.exists(s3.getBundlesBucket(), key)) {
            throw new ObjectNotFoundException(key);
        }

        String url = s3.generateDownloadPresignedUrl(s3.getBundlesBucket(), key);
        return new PresignedUrlResponse(url, key, expirySeconds);
    }
}
