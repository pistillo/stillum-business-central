package com.stillum.registry.filter;

import com.stillum.registry.context.TenantContext;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

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

    @Transactional
    public void propagate() {
        if (tenantContext.isSet()) {
            em.createNativeQuery(
                "SELECT set_config('app.current_tenant', :tid, true)"
            ).setParameter("tid", tenantContext.get().toString())
             .getSingleResult();
        }
    }
}
