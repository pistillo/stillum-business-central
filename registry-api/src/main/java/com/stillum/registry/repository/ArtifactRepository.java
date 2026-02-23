package com.stillum.registry.repository;

import com.stillum.registry.entity.Artifact;
import com.stillum.registry.entity.enums.ArtifactStatus;
import com.stillum.registry.entity.enums.ArtifactType;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import io.quarkus.panache.common.Page;
import io.quarkus.panache.common.Parameters;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@ApplicationScoped
public class ArtifactRepository implements PanacheRepositoryBase<Artifact, UUID> {

    public List<Artifact> findByTenant(
            UUID tenantId,
            ArtifactType type,
            ArtifactStatus status,
            String area,
            String tag,
            int page,
            int pageSize) {
        StringBuilder query = new StringBuilder("tenantId = :tid");
        Parameters params = Parameters.with("tid", tenantId);
        List<String> conditions = new ArrayList<>();

        if (type != null) {
            conditions.add("type = :type");
            params.and("type", type);
        }
        if (status != null) {
            conditions.add("status = :status");
            params.and("status", status);
        }
        if (area != null && !area.isBlank()) {
            conditions.add("area = :area");
            params.and("area", area);
        }

        for (String cond : conditions) {
            query.append(" and ").append(cond);
        }

        return find(query.toString(), params)
                .page(Page.of(page, pageSize))
                .list();
    }

    public long countByTenant(
            UUID tenantId,
            ArtifactType type,
            ArtifactStatus status,
            String area) {
        StringBuilder query = new StringBuilder("tenantId = :tid");
        Parameters params = Parameters.with("tid", tenantId);

        if (type != null) {
            query.append(" and type = :type");
            params.and("type", type);
        }
        if (status != null) {
            query.append(" and status = :status");
            params.and("status", status);
        }
        if (area != null && !area.isBlank()) {
            query.append(" and area = :area");
            params.and("area", area);
        }

        return count(query.toString(), params);
    }

    public Optional<Artifact> findByIdAndTenant(UUID id, UUID tenantId) {
        return find("id = :id and tenantId = :tid",
                Parameters.with("id", id).and("tid", tenantId))
                .firstResultOptional();
    }
}
