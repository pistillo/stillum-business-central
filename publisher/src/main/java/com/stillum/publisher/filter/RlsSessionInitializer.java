package com.stillum.publisher.filter;

import com.stillum.publisher.context.TenantContext;
import com.stillum.publisher.exception.NotFoundException;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import java.util.Optional;
import org.eclipse.microprofile.config.inject.ConfigProperty;

@RequestScoped
public class RlsSessionInitializer {

    @Inject
    EntityManager em;

    @Inject
    TenantContext tenantContext;

    @ConfigProperty(name = "stillum.rls.assume-role")
    Optional<String> assumeRole;

    public void propagate() {
        assumeRole
            .map(String::trim)
            .filter(s -> !s.isEmpty())
            .filter(RlsSessionInitializer::isValidRoleName)
            .ifPresent(role -> em.createNativeQuery("SET LOCAL ROLE " + role).executeUpdate());

        if (!tenantContext.isSet()) {
            throw new IllegalArgumentException("tenantId is required");
        }

        var tenantId = tenantContext.get();
        Number tenantCount = (Number) em.createNativeQuery(
                "SELECT COUNT(1) FROM tenant WHERE id = :tid")
            .setParameter("tid", tenantId)
            .getSingleResult();
        if (tenantCount.longValue() == 0L) {
            throw new NotFoundException("Tenant not found: " + tenantId);
        }

        em.createNativeQuery(
            "SELECT set_config('app.current_tenant', :tid, true)"
        ).setParameter("tid", tenantId.toString())
         .getSingleResult();
    }

    private static boolean isValidRoleName(String role) {
        return role.matches("[A-Za-z_][A-Za-z0-9_]*");
    }
}
