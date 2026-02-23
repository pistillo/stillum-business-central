package com.stillum.publisher.repository;

import com.stillum.publisher.entity.Artifact;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import io.quarkus.panache.common.Parameters;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.Optional;
import java.util.UUID;

@ApplicationScoped
public class ArtifactRepository implements PanacheRepositoryBase<Artifact, UUID> {

    public Optional<Artifact> findByIdAndTenant(UUID id, UUID tenantId) {
        return find("id = :id and tenantId = :tid",
                Parameters.with("id", id).and("tid", tenantId))
                .firstResultOptional();
    }
}

