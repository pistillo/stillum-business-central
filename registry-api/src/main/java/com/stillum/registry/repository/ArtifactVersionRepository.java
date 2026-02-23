package com.stillum.registry.repository;

import com.stillum.registry.entity.ArtifactVersion;
import com.stillum.registry.entity.enums.VersionState;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import io.quarkus.panache.common.Parameters;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@ApplicationScoped
public class ArtifactVersionRepository implements PanacheRepositoryBase<ArtifactVersion, UUID> {

    public List<ArtifactVersion> findByArtifact(UUID artifactId) {
        return list("artifactId = :aid order by createdAt desc",
                Parameters.with("aid", artifactId));
    }

    public Optional<ArtifactVersion> findByIdAndArtifact(UUID versionId, UUID artifactId) {
        return find("id = :id and artifactId = :aid",
                Parameters.with("id", versionId).and("aid", artifactId))
                .firstResultOptional();
    }

    public boolean existsByArtifactAndVersion(UUID artifactId, String version) {
        return count("artifactId = :aid and version = :v",
                Parameters.with("aid", artifactId).and("v", version)) > 0;
    }

    public List<ArtifactVersion> findByArtifactAndState(UUID artifactId, VersionState state) {
        return list("artifactId = :aid and state = :state",
                Parameters.with("aid", artifactId).and("state", state));
    }
}
