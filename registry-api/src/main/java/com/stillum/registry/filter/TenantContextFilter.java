package com.stillum.registry.filter;

import com.stillum.registry.context.TenantContext;
import jakarta.annotation.Priority;
import jakarta.inject.Inject;
import jakarta.ws.rs.Priorities;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.Provider;
import java.util.List;
import java.util.Map;
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
            } catch (IllegalArgumentException e) {
                ctx.abortWith(Response.status(Response.Status.BAD_REQUEST)
                        .type(MediaType.APPLICATION_JSON)
                        .entity(Map.of(
                                "error", "Invalid tenantId format: " + values.get(0),
                                "status", Response.Status.BAD_REQUEST.getStatusCode()))
                        .build());
            }
        }
    }
}
