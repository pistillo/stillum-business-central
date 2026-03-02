package com.stillum.registry.filter;

import com.stillum.registry.context.TenantContext;
import com.stillum.registry.exception.ObjectNotFoundException;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import java.util.Optional;
import org.eclipse.microprofile.config.inject.ConfigProperty;

/**
 * Propaga il tenantId corrente come GUC PostgreSQL (app.current_tenant)
 * per attivare le policy RLS sulla connessione di questa richiesta.
 *
 * Deve essere invocato esplicitamente all'inizio di ogni transazione
 * che accede a tabelle con RLS. Il set_config con il terzo parametro
 * 'true' è locale alla transazione corrente e si azzera automaticamente
 * al commit/rollback.
 */
@RequestScoped
public class RlsSessionInitializer {

    @Inject
    EntityManager em;

    @Inject
    TenantContext tenantContext;

    @ConfigProperty(name = "stillum.rls.assume-role")
    Optional<String> assumeRole;

    public void propagate() {
        // Se assumeRole è configurato, eseguiamo SET LOCAL ROLE
        assumeRole
            .map(String::trim)
            .filter(s -> !s.isEmpty())
            .filter(RlsSessionInitializer::isValidRoleName)
            .ifPresent(role -> em.createNativeQuery("SET LOCAL ROLE " + role).executeUpdate());

        // Se siamo qui (interceptor @EnforceTenantRls), il tenantId DEVE essere presente
        if (!tenantContext.isSet()) {
            throw new IllegalArgumentException("tenantId is required for this operation");
        }

        var tenantId = tenantContext.get();

        // Verifica defense-in-depth che il tenant esista
        Number tenantCount = (Number) em.createNativeQuery(
                "SELECT COUNT(1) FROM tenant WHERE id = :tid")
            .setParameter("tid", tenantId)
            .getSingleResult();
        if (tenantCount.longValue() == 0L) {
            throw new ObjectNotFoundException("Tenant not found: " + tenantId);
        }

        // Imposta la GUC per RLS
        em.createNativeQuery(
            "SELECT set_config('app.current_tenant', :tid, true)"
        ).setParameter("tid", tenantId.toString())
         .getSingleResult();
    }

    private static boolean isValidRoleName(String role) {
        return role.matches("[A-Za-z_][A-Za-z0-9_]*");
    }
}
