package com.stillum.publisher.filter;

import com.stillum.publisher.context.TenantContext;
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
        if (tenantContext.isSet()) {
            assumeRole
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .filter(RlsSessionInitializer::isValidRoleName)
                .ifPresent(role -> em.createNativeQuery("SET LOCAL ROLE " + role).executeUpdate());

            em.createNativeQuery(
                "SELECT set_config('app.current_tenant', :tid, true)"
            ).setParameter("tid", tenantContext.get().toString())
             .getSingleResult();
        }
    }

    private static boolean isValidRoleName(String role) {
        return role.matches("[A-Za-z_][A-Za-z0-9_]*");
    }
}

