package com.stillum.registry.repository;

import com.stillum.registry.entity.Publication;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import io.quarkus.panache.common.Parameters;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@ApplicationScoped
public class PublicationRepository implements PanacheRepositoryBase<Publication, UUID> {

    public List<Publication> findByVersion(UUID artifactVersionId) {
        return list("artifactVersionId = :vid order by publishedAt desc",
                Parameters.with("vid", artifactVersionId));
    }

    public Optional<Publication> findByIdAndVersion(UUID publicationId, UUID artifactVersionId) {
        return find("id = :id and artifactVersionId = :vid",
                Parameters.with("id", publicationId).and("vid", artifactVersionId))
                .firstResultOptional();
    }
}
