package com.stillum.registry.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.stillum.registry.dto.request.CreateArtifactRequest;
import com.stillum.registry.dto.request.CreateComponentRequest;
import com.stillum.registry.dto.request.CreateModuleRequest;
import com.stillum.registry.dto.request.UpdateArtifactRequest;
import com.stillum.registry.dto.response.ArtifactDetailResponse;
import com.stillum.registry.dto.response.ArtifactResponse;
import com.stillum.registry.dto.response.ArtifactVersionResponse;
import com.stillum.registry.dto.response.PagedResponse;
import com.stillum.registry.dto.response.WorkspaceResponse;
import com.stillum.registry.entity.Artifact;
import com.stillum.registry.entity.ArtifactVersion;
import com.stillum.registry.entity.enums.ArtifactStatus;
import com.stillum.registry.entity.enums.ArtifactType;
import com.stillum.registry.entity.enums.VersionState;
import com.stillum.registry.exception.ArtifactNotFoundException;
import com.stillum.registry.filter.EnforceTenantRls;
import com.stillum.registry.repository.ArtifactRepository;
import com.stillum.registry.repository.ArtifactVersionRepository;
import com.stillum.registry.storage.FileStorageService;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@ApplicationScoped
@EnforceTenantRls
public class ArtifactService {

    @Inject
    ArtifactRepository repo;

    @Inject
    ArtifactVersionRepository versionRepo;

    @Inject
    ProjectTemplateService templateService;

    @Inject
    FileStorageService fileStorage;

    @Inject
    ObjectMapper objectMapper;

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
            UUID parentModuleId,
            int page,
            int pageSize) {
        List<ArtifactResponse> items = repo
                .findByTenant(tenantId, type, status, area, tag, parentModuleId, page, pageSize)
                .stream()
                .map(ArtifactResponse::from)
                .toList();
        long total = repo.countByTenant(tenantId, type, status, area, tag, parentModuleId);
        return PagedResponse.of(items, page, pageSize, total);
    }

    @Transactional
    public ArtifactDetailResponse getById(UUID tenantId, UUID artifactId) {
        Artifact artifact = repo.findByIdAndTenant(artifactId, tenantId)
                .orElseThrow(() -> new ArtifactNotFoundException(artifactId));
        List<ArtifactVersion> versions = versionRepo.findByArtifact(artifactId);
        List<ArtifactVersionResponse> versionResponses = versions.stream()
                .map(v -> ArtifactVersionResponse.from(v,
                        fileStorage.loadFiles(tenantId, artifact.type.name(), artifactId, v.id)))
                .toList();
        return ArtifactDetailResponse.from(artifact, versionResponses);
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
    public WorkspaceResponse getWorkspace(UUID tenantId, UUID moduleId) {
        Artifact module = repo.findByIdAndTenant(moduleId, tenantId)
                .orElseThrow(() -> new ArtifactNotFoundException(moduleId));
        if (module.type != ArtifactType.MODULE) {
            throw new IllegalArgumentException("Artifact must be of type MODULE");
        }

        List<ArtifactVersion> moduleVersions = versionRepo.findByArtifact(moduleId);
        ArtifactVersionResponse moduleVersion = moduleVersions.isEmpty()
                ? null
                : ArtifactVersionResponse.from(
                        moduleVersions.get(0),
                        fileStorage.loadFiles(tenantId, "MODULE", moduleId,
                                moduleVersions.get(0).id));

        List<Artifact> components = repo.findByParentModule(tenantId, moduleId);
        List<WorkspaceResponse.ComponentEntry> entries = components.stream()
                .map(comp -> {
                    List<ArtifactVersion> compVersions = versionRepo.findByArtifact(comp.id);
                    ArtifactVersionResponse compVersion = compVersions.isEmpty()
                            ? null
                            : ArtifactVersionResponse.from(
                                    compVersions.get(0),
                                    fileStorage.loadFiles(tenantId, "COMPONENT", comp.id,
                                            compVersions.get(0).id));
                    return new WorkspaceResponse.ComponentEntry(
                            ArtifactResponse.from(comp), compVersion);
                })
                .toList();

        return new WorkspaceResponse(
                ArtifactResponse.from(module), moduleVersion, entries);
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

        var snapshot = templateService.generateSnapshot(
                req.title(), req.description(), req.port(), req.keywords());

        ArtifactVersion version = new ArtifactVersion();
        version.artifactId = artifact.id;
        version.version = "0.1.0";
        version.state = VersionState.DRAFT;
        versionRepo.persist(version);

        // Save template files as individual S3 objects
        if (snapshot.files() != null) {
            fileStorage.saveFiles(tenantId, "MODULE", artifact.id, version.id,
                    snapshot.files());
        }

        // Save template metadata in version.metadata JSONB
        try {
            Map<String, Object> meta = new HashMap<>();
            meta.put("templateVersion", snapshot.templateVersion());
            meta.put("templateInputs", snapshot.inputs());
            meta.put("generatedAt", snapshot.generatedAt());
            version.metadata = objectMapper.writeValueAsString(meta);
        } catch (Exception e) {
            throw new RuntimeException("Failed to serialize template metadata", e);
        }

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
        component.parentModuleId = parentModule.id;
        repo.persist(component);

        Map<String, String> templateFiles = generateComponentTemplate(req.title(), req.area());

        ArtifactVersion version = new ArtifactVersion();
        version.artifactId = component.id;
        version.version = "0.1.0";
        version.state = VersionState.DRAFT;
        versionRepo.persist(version);

        // Save component template files as individual S3 objects
        fileStorage.saveFiles(tenantId, "COMPONENT", component.id, version.id,
                templateFiles);

        return ArtifactResponse.from(component);
    }

    /**
     * Generate a starter source file for a new component based on its area.
     */
    private Map<String, String> generateComponentTemplate(String title, String area) {
        String fileName = title + ".tsx";
        String content = switch (area != null ? area.toLowerCase() : "") {
            case "droplets" -> """
                    import React from 'react';

                    export interface %sProps {
                      children?: React.ReactNode;
                    }

                    export const %s: React.FC<%sProps> = ({ children }) => {
                      return (
                        <div>
                          {children}
                        </div>
                      );
                    };

                    export default %s;
                    """.formatted(title, title, title, title);
            case "pools" -> """
                    import { createContext, useContext, useState, ReactNode } from 'react';

                    interface %sState {
                      // Define your state shape here
                    }

                    const %sContext = createContext<%sState | undefined>(undefined);

                    export function %sProvider({ children }: { children: ReactNode }) {
                      const [state] = useState<%sState>({});

                      return (
                        <%sContext.Provider value={state}>
                          {children}
                        </%sContext.Provider>
                      );
                    }

                    export function use%s() {
                      const context = useContext(%sContext);
                      if (!context) {
                        throw new Error('use%s must be used within a %sProvider');
                      }
                      return context;
                    }
                    """.formatted(title, title, title, title, title, title, title, title, title, title, title);
            case "triggers" -> """
                    /**
                     * %s trigger — handles events and dispatches actions.
                     */

                    export interface %sEvent {
                      type: string;
                      payload?: unknown;
                    }

                    export function on%s(event: %sEvent): void {
                      console.log('[%s] Event received:', event);
                      // Handle the event here
                    }

                    export default on%s;
                    """.formatted(title, title, title, title, title, title);
            default -> """
                    import React from 'react';

                    export const %s: React.FC = () => {
                      return <div>%s</div>;
                    };

                    export default %s;
                    """.formatted(title, title, title);
        };

        return Map.of(fileName, content);
    }
}
