package com.stillum.registry.repository;

import com.stillum.registry.entity.Environment;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import io.quarkus.panache.common.Parameters;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@ApplicationScoped
public class EnvironmentRepository implements PanacheRepositoryBase<Environment, UUID> {

    public List<Environment> findByTenant(UUID tenantId) {
        return list("tenantId = :tid", Parameters.with("tid", tenantId));
    }

    public Optional<Environment> findByIdAndTenant(UUID id, UUID tenantId) {
        return find("id = :id and tenantId = :tid",
                Parameters.with("id", id).and("tid", tenantId))
                .firstResultOptional();
    }
}
