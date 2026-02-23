package com.stillum.registry.service;

import com.stillum.registry.dto.request.CreateVersionRequest;
import com.stillum.registry.dto.request.UpdatePayloadRefRequest;
import com.stillum.registry.dto.request.UpdateVersionRequest;
import com.stillum.registry.dto.response.ArtifactVersionResponse;
import com.stillum.registry.entity.ArtifactVersion;
import com.stillum.registry.entity.enums.VersionState;
import com.stillum.registry.exception.ArtifactNotFoundException;
import com.stillum.registry.exception.ImmutableVersionException;
import com.stillum.registry.repository.ArtifactRepository;
import com.stillum.registry.repository.ArtifactVersionRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class ArtifactVersionService {

    @Inject
    ArtifactVersionRepository versionRepo;

    @Inject
    ArtifactRepository artifactRepo;

    @Transactional
    public ArtifactVersionResponse create(UUID tenantId, UUID artifactId, CreateVersionRequest req) {
        artifactRepo.findByIdAndTenant(artifactId, tenantId)
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
        v.state = VersionState.DRAFT;
        versionRepo.persist(v);
        return ArtifactVersionResponse.from(v);
    }

    public List<ArtifactVersionResponse> listByArtifact(UUID tenantId, UUID artifactId) {
        artifactRepo.findByIdAndTenant(artifactId, tenantId)
                .orElseThrow(() -> new ArtifactNotFoundException(artifactId));
        return versionRepo.findByArtifact(artifactId)
                .stream()
                .map(ArtifactVersionResponse::from)
                .toList();
    }

    public ArtifactVersionResponse getById(UUID tenantId, UUID artifactId, UUID versionId) {
        artifactRepo.findByIdAndTenant(artifactId, tenantId)
                .orElseThrow(() -> new ArtifactNotFoundException(artifactId));
        return versionRepo.findByIdAndArtifact(versionId, artifactId)
                .map(ArtifactVersionResponse::from)
                .orElseThrow(() -> new ArtifactNotFoundException(artifactId, versionId));
    }

    @Transactional
    public ArtifactVersionResponse update(
            UUID tenantId, UUID artifactId, UUID versionId, UpdateVersionRequest req) {
        artifactRepo.findByIdAndTenant(artifactId, tenantId)
                .orElseThrow(() -> new ArtifactNotFoundException(artifactId));
        ArtifactVersion v = versionRepo.findByIdAndArtifact(versionId, artifactId)
                .orElseThrow(() -> new ArtifactNotFoundException(artifactId, versionId));

        assertMutable(v);
        v.payloadRef = req.payloadRef();
        v.metadata = req.metadata();
        return ArtifactVersionResponse.from(v);
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
        return ArtifactVersionResponse.from(v);
    }

    @Transactional
    public ArtifactVersionResponse markPublished(
            UUID tenantId, UUID artifactId, UUID versionId, String bundleRef) {
        artifactRepo.findByIdAndTenant(artifactId, tenantId)
                .orElseThrow(() -> new ArtifactNotFoundException(artifactId));
        ArtifactVersion v = versionRepo.findByIdAndArtifact(versionId, artifactId)
                .orElseThrow(() -> new ArtifactNotFoundException(artifactId, versionId));

        v.state = VersionState.PUBLISHED;
        return ArtifactVersionResponse.from(v);
    }

    private void assertMutable(ArtifactVersion v) {
        if (v.state == VersionState.PUBLISHED) {
            throw new ImmutableVersionException(v.id);
        }
    }
}
