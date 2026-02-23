package com.stillum.registry.service;

import com.stillum.registry.dto.request.CreateArtifactRequest;
import com.stillum.registry.dto.request.UpdateArtifactRequest;
import com.stillum.registry.dto.response.ArtifactResponse;
import com.stillum.registry.dto.response.PagedResponse;
import com.stillum.registry.entity.Artifact;
import com.stillum.registry.entity.enums.ArtifactStatus;
import com.stillum.registry.entity.enums.ArtifactType;
import com.stillum.registry.exception.ArtifactNotFoundException;
import com.stillum.registry.filter.EnforceTenantRls;
import com.stillum.registry.repository.ArtifactRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.UUID;

@ApplicationScoped
@EnforceTenantRls
public class ArtifactService {

    @Inject
    ArtifactRepository repo;

    @Transactional
    public ArtifactResponse create(UUID tenantId, CreateArtifactRequest req) {
        Artifact artifact = new Artifact();
        artifact.tenantId = tenantId;
        artifact.type = req.type();
        artifact.title = req.title();
        artifact.description = req.description();
        artifact.area = req.area();
        if (req.tags() != null) {
            artifact.tags = req.tags().toArray(new String[0]);
        }
        artifact.status = ArtifactStatus.DRAFT;
        repo.persist(artifact);
        return ArtifactResponse.from(artifact);
    }

    @Transactional
    public PagedResponse<ArtifactResponse> list(
            UUID tenantId,
            ArtifactType type,
            ArtifactStatus status,
            String area,
            String tag,
            int page,
            int pageSize) {
        List<ArtifactResponse> items = repo.findByTenant(tenantId, type, status, area, tag, page, pageSize)
                .stream()
                .map(ArtifactResponse::from)
                .toList();
        long total = repo.countByTenant(tenantId, type, status, area);
        return PagedResponse.of(items, page, pageSize, total);
    }

    @Transactional
    public ArtifactResponse getById(UUID tenantId, UUID artifactId) {
        return repo.findByIdAndTenant(artifactId, tenantId)
                .map(ArtifactResponse::from)
                .orElseThrow(() -> new ArtifactNotFoundException(artifactId));
    }

    @Transactional
    public ArtifactResponse update(UUID tenantId, UUID artifactId, UpdateArtifactRequest req) {
        Artifact artifact = repo.findByIdAndTenant(artifactId, tenantId)
                .orElseThrow(() -> new ArtifactNotFoundException(artifactId));
        artifact.title = req.title();
        artifact.description = req.description();
        artifact.area = req.area();
        if (req.tags() != null) {
            artifact.tags = req.tags().toArray(new String[0]);
        }
        return ArtifactResponse.from(artifact);
    }

    @Transactional
    public void retire(UUID tenantId, UUID artifactId) {
        Artifact artifact = repo.findByIdAndTenant(artifactId, tenantId)
                .orElseThrow(() -> new ArtifactNotFoundException(artifactId));
        artifact.status = ArtifactStatus.RETIRED;
    }
}
