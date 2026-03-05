package com.stillum.registry.service;

import com.stillum.registry.dto.request.CreateVersionRequest;
import com.stillum.registry.dto.request.UpdatePayloadRefRequest;
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
import com.stillum.registry.storage.SourceBundle;
import com.stillum.registry.storage.SourceStorageService;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.UUID;

@ApplicationScoped
@EnforceTenantRls
public class ArtifactVersionService {

    @Inject
    ArtifactVersionRepository versionRepo;

    @Inject
    ArtifactRepository artifactRepo;

    @Inject
    SourceStorageService sourceStorage;

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
        v.payloadRef = req.payloadRef();
        v.metadata = req.metadata();
        v.npmDependencies = req.npmDependencies();
        v.npmPackageRef = req.npmPackageRef();
        v.state = VersionState.DRAFT;
        versionRepo.persist(v);

        // Save source data to MinIO
        String sourceRef = sourceStorage.save(
                tenantId, artifactId, v.id,
                req.sourceCode(), req.sourceFiles(), req.buildSnapshot());
        v.sourceRef = sourceRef;

        SourceBundle source = new SourceBundle(req.sourceCode(), req.sourceFiles(), req.buildSnapshot());
        return ArtifactVersionResponse.from(v, source);
    }

    @Transactional
    public List<ArtifactVersionResponse> listByArtifact(UUID tenantId, UUID artifactId) {
        artifactRepo.findByIdAndTenant(artifactId, tenantId)
                .orElseThrow(() -> new ArtifactNotFoundException(artifactId));
        return versionRepo.findByArtifact(artifactId)
                .stream()
                .map(v -> ArtifactVersionResponse.from(v, sourceStorage.load(v.sourceRef)))
                .toList();
    }

    @Transactional
    public ArtifactVersionResponse getById(UUID tenantId, UUID artifactId, UUID versionId) {
        artifactRepo.findByIdAndTenant(artifactId, tenantId)
                .orElseThrow(() -> new ArtifactNotFoundException(artifactId));
        ArtifactVersion v = versionRepo.findByIdAndArtifact(versionId, artifactId)
                .orElseThrow(() -> new ArtifactNotFoundException(artifactId, versionId));
        return ArtifactVersionResponse.from(v, sourceStorage.load(v.sourceRef));
    }

    @Transactional
    public ArtifactVersionResponse update(
            UUID tenantId, UUID artifactId, UUID versionId, UpdateVersionRequest req) {
        Artifact artifact = artifactRepo.findByIdAndTenant(artifactId, tenantId)
                .orElseThrow(() -> new ArtifactNotFoundException(artifactId));
        ArtifactVersion v = versionRepo.findByIdAndArtifact(versionId, artifactId)
                .orElseThrow(() -> new ArtifactNotFoundException(artifactId, versionId));

        assertMutable(v);
        if (req.payloadRef() != null) {
            v.payloadRef = req.payloadRef();
        }
        if (req.metadata() != null) {
            v.metadata = req.metadata();
        }
        if (req.npmDependencies() != null) {
            v.npmDependencies = req.npmDependencies();
        }
        if (req.npmPackageRef() != null) {
            v.npmPackageRef = req.npmPackageRef();
        }

        // If any source-related field is being updated, reload the existing bundle,
        // merge changes, and write back to MinIO.
        boolean sourceChanged = req.sourceCode() != null
                || req.sourceFiles() != null
                || req.buildSnapshot() != null;

        SourceBundle source;
        if (sourceChanged) {
            SourceBundle existing = sourceStorage.load(v.sourceRef);
            String newSourceCode = req.sourceCode() != null ? req.sourceCode() : existing.sourceCode();
            var newSourceFiles = req.sourceFiles() != null ? req.sourceFiles() : existing.sourceFiles();
            var newBuildSnapshot = req.buildSnapshot() != null ? req.buildSnapshot() : existing.buildSnapshot();

            String sourceRef = sourceStorage.save(
                    tenantId, artifactId, versionId,
                    newSourceCode, newSourceFiles, newBuildSnapshot);
            v.sourceRef = sourceRef;
            source = new SourceBundle(newSourceCode, newSourceFiles, newBuildSnapshot);
        } else {
            source = sourceStorage.load(v.sourceRef);
        }

        return ArtifactVersionResponse.from(v, source);
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
    public ArtifactVersionResponse updatePayloadRef(
            UUID tenantId, UUID artifactId, UUID versionId, UpdatePayloadRefRequest req) {
        artifactRepo.findByIdAndTenant(artifactId, tenantId)
                .orElseThrow(() -> new ArtifactNotFoundException(artifactId));
        ArtifactVersion v = versionRepo.findByIdAndArtifact(versionId, artifactId)
                .orElseThrow(() -> new ArtifactNotFoundException(artifactId, versionId));

        assertMutable(v);
        v.payloadRef = req.payloadRef();
        return ArtifactVersionResponse.from(v, sourceStorage.load(v.sourceRef));
    }

    @Transactional
    public ArtifactVersionResponse markPublished(
            UUID tenantId, UUID artifactId, UUID versionId, String bundleRef) {
        artifactRepo.findByIdAndTenant(artifactId, tenantId)
                .orElseThrow(() -> new ArtifactNotFoundException(artifactId));
        ArtifactVersion v = versionRepo.findByIdAndArtifact(versionId, artifactId)
                .orElseThrow(() -> new ArtifactNotFoundException(artifactId, versionId));

        v.state = VersionState.PUBLISHED;
        return ArtifactVersionResponse.from(v, sourceStorage.load(v.sourceRef));
    }

    private void assertMutable(ArtifactVersion v) {
        if (v.state == VersionState.PUBLISHED) {
            throw new ImmutableVersionException(v.id);
        }
    }
}
