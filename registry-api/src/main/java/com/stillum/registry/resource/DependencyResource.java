package com.stillum.registry.resource;

import com.stillum.registry.dto.request.AddDependencyRequest;
import com.stillum.registry.dto.response.DependencyResponse;
import com.stillum.registry.service.DependencyService;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;
import java.util.UUID;

@Path("/tenants/{tenantId}/artifacts/{artifactId}/versions/{versionId}/dependencies")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class DependencyResource {

    @Inject
    DependencyService service;

    @GET
    public Response list(
            @PathParam("tenantId") UUID tenantId,
            @PathParam("artifactId") UUID artifactId,
            @PathParam("versionId") UUID versionId) {
        List<DependencyResponse> resp = service.list(tenantId, artifactId, versionId);
        return Response.ok(resp).build();
    }

    @POST
    public Response add(
            @PathParam("tenantId") UUID tenantId,
            @PathParam("artifactId") UUID artifactId,
            @PathParam("versionId") UUID versionId,
            @Valid AddDependencyRequest req) {
        DependencyResponse resp = service.add(tenantId, artifactId, versionId, req);
        return Response.status(Response.Status.CREATED).entity(resp).build();
    }

    @DELETE
    @Path("/{dependencyId}")
    public Response remove(
            @PathParam("tenantId") UUID tenantId,
            @PathParam("artifactId") UUID artifactId,
            @PathParam("versionId") UUID versionId,
            @PathParam("dependencyId") UUID dependencyId) {
        service.remove(tenantId, artifactId, versionId, dependencyId);
        return Response.noContent().build();
    }
}
