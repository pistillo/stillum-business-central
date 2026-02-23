package com.stillum.publisher.repository;

import com.stillum.publisher.entity.Dependency;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import io.quarkus.panache.common.Parameters;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class DependencyRepository implements PanacheRepositoryBase<Dependency, UUID> {

    public List<Dependency> findByVersion(UUID versionId) {
        return list("artifactVersionId = :vid", Parameters.with("vid", versionId));
    }
}

