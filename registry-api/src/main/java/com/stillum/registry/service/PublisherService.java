package com.stillum.registry.service;

import com.stillum.registry.dto.PublishRequest;
import com.stillum.registry.dto.PublicationResponse;
import com.stillum.registry.entity.ArtifactVersion;
import com.stillum.registry.entity.Publication;
import com.stillum.registry.entity.enums.VersionState;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.UUID;

@ApplicationScoped
public class PublisherService {

    @Transactional
    public Publication publish(PublishRequest request, UUID publishedBy) {
        ArtifactVersion version = ArtifactVersion.findById(request.versionId);
        if (version == null || version.state != VersionState.APPROVED) {
            return null;
        }
        
        Publication publication = new Publication();
        publication.artifactVersionId = request.versionId;
        publication.environmentId = request.environmentId;
        publication.publishedBy = publishedBy;
        publication.publishedAt = LocalDateTime.now();
        publication.notes = request.notes;
        publication.releaseNotes = request.releaseNotes;
        publication.persist();
        
        version.state = VersionState.PUBLISHED;
        version.persist();
        
        return publication;
    }

    public Publication getPublication(UUID publicationId) {
        return Publication.findById(publicationId);
    }

    public PublicationResponse toPublicationResponse(Publication publication) {
        PublicationResponse response = new PublicationResponse();
        response.id = publication.id;
        response.artifactVersionId = publication.artifactVersionId;
        response.environmentId = publication.environmentId;
        response.publishedBy = publication.publishedBy;
        response.publishedAt = publication.publishedAt;
        response.notes = publication.notes;
        response.bundleRef = publication.bundleRef;
        response.releaseNotes = publication.releaseNotes;
        return response;
    }
}
