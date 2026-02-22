package com.stillum.registry.resource;

import com.stillum.registry.entity.Tenant;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Path("/api/v1/tenants")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Tenants")
public class TenantResource {

    @POST
    @Operation(summary = "Create a new tenant")
    public Response createTenant(Tenant tenant) {
        if (tenant.createdAt == null) {
            tenant.createdAt = LocalDateTime.now();
        }
        tenant.persist();
        return Response.status(Response.Status.CREATED).entity(tenant).build();
    }

    @GET
    @Operation(summary = "List all tenants")
    public Response listTenants(
            @QueryParam("page") @DefaultValue("0") int page,
            @QueryParam("size") @DefaultValue("20") int size) {
        List<Tenant> tenants = Tenant.findAll()
            .page(page, size)
            .list();
        return Response.ok(tenants).build();
    }

    @GET
    @Path("/{tenantId}")
    @Operation(summary = "Get tenant by ID")
    public Response getTenant(@PathParam("tenantId") UUID tenantId) {
        Tenant tenant = Tenant.findById(tenantId);
        if (tenant == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(tenant).build();
    }
}
