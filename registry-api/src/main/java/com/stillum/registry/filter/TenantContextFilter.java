package com.stillum.registry.filter;

import com.stillum.registry.context.TenantContext;
import jakarta.annotation.Priority;
import jakarta.inject.Inject;
import jakarta.ws.rs.Priorities;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.ext.Provider;
import java.util.List;
import java.util.UUID;

@Provider
@Priority(Priorities.AUTHENTICATION)
public class TenantContextFilter implements ContainerRequestFilter {

    @Inject
    TenantContext tenantContext;

    @Override
    public void filter(ContainerRequestContext ctx) {
        List<String> values = ctx.getUriInfo().getPathParameters().get("tenantId");
        if (values != null && !values.isEmpty()) {
            try {
                tenantContext.set(UUID.fromString(values.get(0)));
            } catch (IllegalArgumentException ignored) {
                // Tenant ID non valido – lasciamo che il resource method gestisca il 400
            }
        }
    }
}
