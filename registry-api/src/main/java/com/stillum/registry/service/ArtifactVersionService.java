package com.stillum.registry.service;

import com.stillum.registry.dto.request.CreateVersionRequest;
import com.stillum.registry.dto.request.UpdateVersionRequest;
import com.stillum.registry.dto.response.ArtifactVersionResponse;
import com.stillum.registry.entity.Artifact;
import com.stillum.registry.entity.ArtifactVersion;
import com.stillum.registry.entity.enums.VersionState;
import com.stillum.registry.exception.ArtifactNotFoundException;
import com.stillum.registry.exception.ImmutableVersionException;
import com.stillum.registry.filter.EnforceTenantRls;
import com.stillum.registry.repository.ArtifactRepository;
import com.stillum.registry.repository.ArtifactVersionRepository;
import com.stillum.registry.storage.FileStorageService;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@ApplicationScoped
@EnforceTenantRls
public class ArtifactVersionService {

    @Inject
    ArtifactVersionRepository versionRepo;

    @Inject
    ArtifactRepository artifactRepo;

    @Inject
    FileStorageService fileStorage;

    @Transactional
    public ArtifactVersionResponse create(UUID tenantId, UUID artifactId, CreateVersionRequest req) {
        Artifact artifact = artifactRepo.findByIdAndTenant(artifactId, tenantId)
                .orElseThrow(() -> new ArtifactNotFoundException(artifactId));

        if (versionRepo.existsByArtifactAndVersion(artifactId, req.version())) {
            throw new IllegalArgumentException(
                "Version '" + req.version() + "' already exists for artifact " + artifactId);
        }

        ArtifactVersion v = new ArtifactVersion();
        v.artifactId = artifactId;
        v.version = req.version();
        v.metadata = req.metadata();
        v.npmPackageRef = req.npmPackageRef();
        v.state = VersionState.DRAFT;
        versionRepo.persist(v);

        // Save files to MinIO (if provided)
        if (req.files() != null && !req.files().isEmpty()) {
            fileStorage.saveFiles(tenantId, artifact.type.name(),
                    artifactId, v.id, req.files());
        }

        Map<String, String> files = req.files() != null ? req.files() : Map.of();
        return ArtifactVersionResponse.from(v, files);
    }

    @Transactional
    public List<ArtifactVersionResponse> listByArtifact(UUID tenantId, UUID artifactId) {
        Artifact artifact = artifactRepo.findByIdAndTenant(artifactId, tenantId)
                .orElseThrow(() -> new ArtifactNotFoundException(artifactId));
        return versionRepo.findByArtifact(artifactId)
                .stream()
                .map(v -> ArtifactVersionResponse.from(v,
                        fileStorage.loadFiles(tenantId, artifact.type.name(), artifactId, v.id)))
                .toList();
    }

    @Transactional
    public ArtifactVersionResponse getById(UUID tenantId, UUID artifactId, UUID versionId) {
        Artifact artifact = artifactRepo.findByIdAndTenant(artifactId, tenantId)
                .orElseThrow(() -> new ArtifactNotFoundException(artifactId));
        ArtifactVersion v = versionRepo.findByIdAndArtifact(versionId, artifactId)
                .orElseThrow(() -> new ArtifactNotFoundException(artifactId, versionId));
        return ArtifactVersionResponse.from(v,
                fileStorage.loadFiles(tenantId, artifact.type.name(), artifactId, versionId));
    }

    @Transactional
    public ArtifactVersionResponse update(
            UUID tenantId, UUID artifactId, UUID versionId, UpdateVersionRequest req) {
        Artifact artifact = artifactRepo.findByIdAndTenant(artifactId, tenantId)
                .orElseThrow(() -> new ArtifactNotFoundException(artifactId));
        ArtifactVersion v = versionRepo.findByIdAndArtifact(versionId, artifactId)
                .orElseThrow(() -> new ArtifactNotFoundException(artifactId, versionId));

        assertMutable(v);
        if (req.metadata() != null) {
            v.metadata = req.metadata();
        }
        if (req.npmPackageRef() != null) {
            v.npmPackageRef = req.npmPackageRef();
        }

        // Save individual files (merge: creates/updates the specified files)
        if (req.files() != null && !req.files().isEmpty()) {
            fileStorage.saveFiles(tenantId, artifact.type.name(),
                    artifactId, versionId, req.files());
        }

        Map<String, String> files = fileStorage.loadFiles(
                tenantId, artifact.type.name(), artifactId, versionId);
        return ArtifactVersionResponse.from(v, files);
    }

    @Transactional
    public void delete(UUID tenantId, UUID artifactId, UUID versionId) {
        artifactRepo.findByIdAndTenant(artifactId, tenantId)
                .orElseThrow(() -> new ArtifactNotFoundException(artifactId));
        ArtifactVersion v = versionRepo.findByIdAndArtifact(versionId, artifactId)
                .orElseThrow(() -> new ArtifactNotFoundException(artifactId, versionId));

        assertMutable(v);
        versionRepo.delete(v);
    }

    @Transactional
    public ArtifactVersionResponse markPublished(
            UUID tenantId, UUID artifactId, UUID versionId, String bundleRef) {
        Artifact artifact = artifactRepo.findByIdAndTenant(artifactId, tenantId)
                .orElseThrow(() -> new ArtifactNotFoundException(artifactId));
        ArtifactVersion v = versionRepo.findByIdAndArtifact(versionId, artifactId)
                .orElseThrow(() -> new ArtifactNotFoundException(artifactId, versionId));

        v.state = VersionState.PUBLISHED;
        return ArtifactVersionResponse.from(v,
                fileStorage.loadFiles(tenantId, artifact.type.name(), artifactId, versionId));
    }

    private void assertMutable(ArtifactVersion v) {
        if (v.state == VersionState.PUBLISHED) {
            throw new ImmutableVersionException(v.id);
        }
    }
}
