package com.stillum.registry.service;

import com.stillum.registry.dto.*;
import com.stillum.registry.entity.Artifact;
import com.stillum.registry.entity.enums.ArtifactStatus;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class ArtifactService {

    @Transactional
    public Artifact createArtifact(UUID tenantId, UUID userId, CreateArtifactRequest request) {
        Artifact artifact = new Artifact();
        artifact.tenantId = tenantId;
        artifact.type = request.type;
        artifact.title = request.title;
        artifact.description = request.description;
        artifact.tags = request.tags;
        artifact.area = request.area;
        artifact.ownerId = userId;
        artifact.status = ArtifactStatus.DRAFT;
        artifact.deleted = false;
        artifact.persist();
        return artifact;
    }

    @Transactional
    public Artifact updateArtifact(UUID artifactId, UpdateArtifactRequest request) {
        Artifact artifact = Artifact.findById(artifactId);
        if (artifact == null || artifact.deleted) {
            return null;
        }
        if (request.title != null) artifact.title = request.title;
        if (request.description != null) artifact.description = request.description;
        if (request.tags != null) artifact.tags = request.tags;
        if (request.area != null) artifact.area = request.area;
        artifact.updatedAt = LocalDateTime.now();
        artifact.persist();
        return artifact;
    }

    @Transactional
    public void deleteArtifact(UUID artifactId) {
        Artifact artifact = Artifact.findById(artifactId);
        if (artifact != null) {
            artifact.deleted = true;
            artifact.updatedAt = LocalDateTime.now();
            artifact.persist();
        }
    }

    public Artifact getArtifact(UUID artifactId) {
        Artifact artifact = Artifact.findById(artifactId);
        if (artifact != null && !artifact.deleted) {
            return artifact;
        }
        return null;
    }

    public PagedResponse<ArtifactResponse> listArtifacts(UUID tenantId, SearchRequest request) {
        int page = request.page;
        int size = request.size;
        
        String query = "tenantId = ?1 and deleted = false";
        Object[] params = {tenantId};
        
        if (request.type != null) {
            query += " and type = ?";
            Object[] newParams = new Object[params.length + 1];
            System.arraycopy(params, 0, newParams, 0, params.length);
            newParams[params.length] = request.type;
            params = newParams;
        }
        
        if (request.status != null) {
            query += " and status = ?";
            Object[] newParams = new Object[params.length + 1];
            System.arraycopy(params, 0, newParams, 0, params.length);
            newParams[params.length] = request.status;
            params = newParams;
        }
        
        long count = Artifact.count(query, params);
        List<Artifact> artifacts = Artifact.find(query, params)
            .page(page, size)
            .list();
        
        List<ArtifactResponse> responses = artifacts.stream()
            .map(this::toArtifactResponse)
            .toList();
        
        return new PagedResponse<>(responses, page, size, count);
    }

    private ArtifactResponse toArtifactResponse(Artifact artifact) {
        ArtifactResponse response = new ArtifactResponse();
        response.id = artifact.id;
        response.tenantId = artifact.tenantId;
        response.type = artifact.type;
        response.title = artifact.title;
        response.description = artifact.description;
        response.ownerId = artifact.ownerId;
        response.status = artifact.status;
        response.tags = artifact.tags;
        response.area = artifact.area;
        response.createdAt = artifact.createdAt;
        response.updatedAt = artifact.updatedAt;
        response.deleted = artifact.deleted;
        return response;
    }
}
