package com.stillum.registry.service;

import com.stillum.registry.dto.request.CreateArtifactRequest;
import com.stillum.registry.dto.request.CreateComponentRequest;
import com.stillum.registry.dto.request.CreateModuleRequest;
import com.stillum.registry.dto.request.UpdateArtifactRequest;
import com.stillum.registry.dto.response.ArtifactDetailResponse;
import com.stillum.registry.dto.response.ArtifactResponse;
import com.stillum.registry.dto.response.PagedResponse;
import com.stillum.registry.entity.Artifact;
import com.stillum.registry.entity.ArtifactVersion;
import com.stillum.registry.entity.enums.ArtifactStatus;
import com.stillum.registry.entity.enums.ArtifactType;
import com.stillum.registry.entity.enums.VersionState;
import com.stillum.registry.exception.ArtifactNotFoundException;
import com.stillum.registry.filter.EnforceTenantRls;
import com.stillum.registry.repository.ArtifactRepository;
import com.stillum.registry.repository.ArtifactVersionRepository;
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

    @Inject
    ArtifactVersionRepository versionRepo;

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
        long total = repo.countByTenant(tenantId, type, status, area, tag);
        return PagedResponse.of(items, page, pageSize, total);
    }

    @Transactional
    public ArtifactDetailResponse getById(UUID tenantId, UUID artifactId) {
        Artifact artifact = repo.findByIdAndTenant(artifactId, tenantId)
                .orElseThrow(() -> new ArtifactNotFoundException(artifactId));
        return ArtifactDetailResponse.from(artifact, versionRepo.findByArtifact(artifactId));
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

    @Transactional
    public ArtifactResponse createModule(UUID tenantId, CreateModuleRequest req) {
        Artifact artifact = new Artifact();
        artifact.tenantId = tenantId;
        artifact.type = ArtifactType.MODULE;
        artifact.title = req.title();
        artifact.description = req.description();
        artifact.area = req.area();
        if (req.tags() != null) {
            artifact.tags = req.tags().toArray(new String[0]);
        }
        artifact.status = ArtifactStatus.DRAFT;
        repo.persist(artifact);

        ArtifactVersion version = new ArtifactVersion();
        version.artifactId = artifact.id;
        version.version = "0.1.0";
        version.state = VersionState.DRAFT;
        versionRepo.persist(version);

        return ArtifactResponse.from(artifact);
    }

    @Transactional
    public ArtifactResponse createComponent(UUID tenantId, CreateComponentRequest req) {
        Artifact parentModule = repo.findByIdAndTenant(req.parentModuleId(), tenantId)
                .orElseThrow(() -> new IllegalArgumentException("Parent module not found: " + req.parentModuleId()));
        if (parentModule.type != ArtifactType.MODULE) {
            throw new IllegalArgumentException("Parent artifact must be of type MODULE");
        }

        Artifact component = new Artifact();
        component.tenantId = tenantId;
        component.type = ArtifactType.COMPONENT;
        component.title = req.title();
        component.description = req.description();
        component.area = req.area();
        if (req.tags() != null) {
            component.tags = req.tags().toArray(new String[0]);
        }
        component.status = ArtifactStatus.DRAFT;
        repo.persist(component);

        ArtifactVersion parentVersion = versionRepo.findByArtifact(parentModule.id).stream()
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("No version found for parent module"));

        ArtifactVersion version = new ArtifactVersion();
        version.artifactId = component.id;
        version.version = "0.1.0";
        version.state = VersionState.DRAFT;
        versionRepo.persist(version);

        return ArtifactResponse.from(component);
    }
}
