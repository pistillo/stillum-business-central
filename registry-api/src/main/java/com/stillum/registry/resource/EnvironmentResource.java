package com.stillum.registry.resource;

import com.stillum.registry.entity.Environment;
import com.stillum.registry.filter.TenantContext;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;
import java.util.List;
import java.util.UUID;

@Path("/api/v1/tenants/{tenantId}/environments")
@Produces(MediaType.APPLICATION_JSON)
@Tag(name = "Environments")
public class EnvironmentResource {

    @Inject
    TenantContext tenantContext;

    @GET
    @Operation(summary = "List environments")
    public Response listEnvironments(
            @PathParam("tenantId") UUID tenantId) {
        if (!tenantId.equals(tenantContext.getTenantId())) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }
        
        List<Environment> environments = Environment.find("tenantId", tenantId).list();
        return Response.ok(environments).build();
    }
}
