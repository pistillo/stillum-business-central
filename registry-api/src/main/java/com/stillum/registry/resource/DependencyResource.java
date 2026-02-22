package com.stillum.registry.resource;

import com.stillum.registry.dto.CreateDependencyRequest;
import com.stillum.registry.dto.DependencyResponse;
import com.stillum.registry.entity.Dependency;
import com.stillum.registry.filter.TenantContext;
import com.stillum.registry.service.DependencyService;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;
import java.util.List;
import java.util.UUID;

@Path("/api/v1/tenants/{tenantId}/artifacts/{artifactId}/versions/{versionId}/dependencies")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Dependencies")
public class DependencyResource {

    @Inject
    DependencyService dependencyService;

    @Inject
    TenantContext tenantContext;

    @POST
    @Operation(summary = "Add a dependency")
    public Response addDependency(
            @PathParam("tenantId") UUID tenantId,
            @PathParam("artifactId") UUID artifactId,
            @PathParam("versionId") UUID versionId,
            @Valid CreateDependencyRequest request) {
        if (!tenantId.equals(tenantContext.getTenantId())) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }
        
        Dependency dependency = dependencyService.addDependency(versionId, request);
        if (dependency == null) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Cyclic dependency detected").build();
        }
        return Response.status(Response.Status.CREATED).entity(dependencyService.toDependencyResponse(dependency)).build();
    }

    @GET
    @Operation(summary = "List dependencies")
    public Response listDependencies(
            @PathParam("tenantId") UUID tenantId,
            @PathParam("artifactId") UUID artifactId,
            @PathParam("versionId") UUID versionId) {
        if (!tenantId.equals(tenantContext.getTenantId())) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }
        
        List<Dependency> dependencies = dependencyService.getDependencies(versionId);
        List<DependencyResponse> responses = dependencies.stream()
            .map(dependencyService::toDependencyResponse)
            .toList();
        return Response.ok(responses).build();
    }
}
