package com.stillum.registry.service;

import com.stillum.registry.dto.CreateVersionRequest;
import com.stillum.registry.dto.UpdateVersionRequest;
import com.stillum.registry.dto.VersionResponse;
import com.stillum.registry.entity.ArtifactVersion;
import com.stillum.registry.entity.enums.VersionState;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.UUID;

@ApplicationScoped
public class VersionService {

    @Transactional
    public ArtifactVersion createVersion(UUID artifactId, UUID userId, CreateVersionRequest request) {
        ArtifactVersion version = new ArtifactVersion();
        version.artifactId = artifactId;
        version.version = request.version;
        version.payloadRef = request.payloadRef;
        version.metadata = request.metadata;
        version.createdBy = userId;
        version.state = VersionState.DRAFT;
        version.persist();
        return version;
    }

    @Transactional
    public ArtifactVersion updateVersion(UUID versionId, UpdateVersionRequest request) {
        ArtifactVersion version = ArtifactVersion.findById(versionId);
        if (version == null || version.state != VersionState.DRAFT) {
            return null;
        }
        if (request.payloadRef != null) version.payloadRef = request.payloadRef;
        if (request.metadata != null) version.metadata = request.metadata;
        version.persist();
        return version;
    }

    @Transactional
    public void deleteVersion(UUID versionId) {
        ArtifactVersion version = ArtifactVersion.findById(versionId);
        if (version != null && version.state == VersionState.DRAFT) {
            version.delete();
        }
    }

    @Transactional
    public ArtifactVersion transitionState(UUID versionId, VersionState targetState) {
        ArtifactVersion version = ArtifactVersion.findById(versionId);
        if (version == null) {
            return null;
        }
        
        if (isValidTransition(version.state, targetState)) {
            version.state = targetState;
            version.persist();
            return version;
        }
        return null;
    }

    public ArtifactVersion getVersion(UUID versionId) {
        return ArtifactVersion.findById(versionId);
    }

    private boolean isValidTransition(VersionState from, VersionState to) {
        return switch (from) {
            case DRAFT -> to == VersionState.REVIEW || to == VersionState.DRAFT;
            case REVIEW -> to == VersionState.APPROVED || to == VersionState.DRAFT;
            case APPROVED -> to == VersionState.PUBLISHED;
            case PUBLISHED -> to == VersionState.RETIRED;
            case RETIRED -> false;
        };
    }

    public VersionResponse toVersionResponse(ArtifactVersion version) {
        VersionResponse response = new VersionResponse();
        response.id = version.id;
        response.artifactId = version.artifactId;
        response.version = version.version;
        response.state = version.state;
        response.payloadRef = version.payloadRef;
        response.createdBy = version.createdBy;
        response.createdAt = version.createdAt;
        response.metadata = version.metadata;
        return response;
    }
}
