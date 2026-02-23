package com.stillum.publisher.repository;

import com.stillum.publisher.entity.ArtifactVersion;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import io.quarkus.panache.common.Parameters;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.Optional;
import java.util.UUID;

@ApplicationScoped
public class ArtifactVersionRepository implements PanacheRepositoryBase<ArtifactVersion, UUID> {

    public Optional<ArtifactVersion> findByIdAndArtifact(UUID id, UUID artifactId) {
        return find("id = :id and artifactId = :aid",
                Parameters.with("id", id).and("aid", artifactId))
                .firstResultOptional();
    }
}

