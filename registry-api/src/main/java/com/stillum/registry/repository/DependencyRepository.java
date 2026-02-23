package com.stillum.registry.repository;

import com.stillum.registry.entity.Dependency;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import io.quarkus.panache.common.Parameters;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@ApplicationScoped
public class DependencyRepository implements PanacheRepositoryBase<Dependency, UUID> {

    public List<Dependency> findByVersion(UUID artifactVersionId) {
        return list("artifactVersionId = :vid",
                Parameters.with("vid", artifactVersionId));
    }

    public Optional<Dependency> findByVersionAndDependsOn(
            UUID artifactVersionId, UUID dependsOnVersionId) {
        return find("artifactVersionId = :vid and dependsOnVersionId = :dvid",
                Parameters.with("vid", artifactVersionId).and("dvid", dependsOnVersionId))
                .firstResultOptional();
    }

    public void deleteByVersion(UUID artifactVersionId) {
        delete("artifactVersionId = :vid",
                Parameters.with("vid", artifactVersionId));
    }
}
