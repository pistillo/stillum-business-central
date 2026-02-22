package com.stillum.registry.service;

import com.stillum.registry.dto.*;
import com.stillum.registry.entity.Artifact;
import com.stillum.registry.entity.enums.ArtifactStatus;
import com.stillum.registry.entity.enums.ArtifactType;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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

        // Build dynamic query with named parameters (no positional param bugs)
        StringBuilder queryBuilder = new StringBuilder("tenantId = :tenantId and deleted = false");
        Map<String, Object> params = new HashMap<>();
        params.put("tenantId", tenantId);

        if (request.type != null) {
            queryBuilder.append(" and type = :type");
            params.put("type", request.type);
        }

        if (request.status != null) {
            queryBuilder.append(" and status = :status");
            params.put("status", request.status);
        }

        if (request.area != null && !request.area.isBlank()) {
            queryBuilder.append(" and area = :area");
            params.put("area", request.area);
        }

        if (request.query != null && !request.query.isBlank()) {
            queryBuilder.append(" and (lower(title) like :query or lower(description) like :query)");
            params.put("query", "%" + request.query.toLowerCase() + "%");
        }

        String query = queryBuilder.toString();
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
