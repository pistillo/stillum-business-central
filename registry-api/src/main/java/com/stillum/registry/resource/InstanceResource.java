package com.stillum.registry.resource;

import com.stillum.registry.entity.Instance;
import com.stillum.registry.filter.TenantContext;
import com.stillum.registry.service.InstanceService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;
import java.util.List;
import java.util.UUID;

@Path("/api/v1/tenants/{tenantId}/instances")
@Produces(MediaType.APPLICATION_JSON)
@Tag(name = "Instances")
public class InstanceResource {

    @Inject
    InstanceService instanceService;

    @Inject
    TenantContext tenantContext;

    @POST
    @Operation(summary = "Start a new instance")
    public Response startInstance(
            @PathParam("tenantId") UUID tenantId,
            @QueryParam("versionId") UUID versionId,
            @QueryParam("correlationKey") String correlationKey,
            @QueryParam("businessKey") String businessKey) {
        if (!tenantId.equals(tenantContext.getTenantId())) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }
        
        Instance instance = instanceService.startInstance(tenantId, versionId, correlationKey, businessKey);
        return Response.status(Response.Status.CREATED).entity(instance).build();
    }

    @GET
    @Operation(summary = "List instances")
    public Response listInstances(
            @PathParam("tenantId") UUID tenantId,
            @QueryParam("page") @DefaultValue("0") int page,
            @QueryParam("size") @DefaultValue("20") int size) {
        if (!tenantId.equals(tenantContext.getTenantId())) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }
        
        List<Instance> instances = instanceService.listInstances(tenantId, page, size);
        return Response.ok(instances).build();
    }

    @GET
    @Path("/{instanceId}")
    @Operation(summary = "Get instance details")
    public Response getInstance(
            @PathParam("tenantId") UUID tenantId,
            @PathParam("instanceId") UUID instanceId) {
        if (!tenantId.equals(tenantContext.getTenantId())) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }
        
        Instance instance = instanceService.getInstance(instanceId);
        if (instance == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(instance).build();
    }

    @GET
    @Path("/{instanceId}/history")
    @Operation(summary = "Get instance history")
    public Response getInstanceHistory(
            @PathParam("tenantId") UUID tenantId,
            @PathParam("instanceId") UUID instanceId) {
        if (!tenantId.equals(tenantContext.getTenantId())) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }
        
        return Response.ok("{\"history\": []}").build();
    }
}
