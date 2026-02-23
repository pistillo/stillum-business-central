package com.stillum.registry.resource;

import com.stillum.registry.dto.request.CreateVersionRequest;
import com.stillum.registry.dto.request.UpdatePayloadRefRequest;
import com.stillum.registry.dto.request.UpdateVersionRequest;
import com.stillum.registry.dto.response.ArtifactVersionResponse;
import com.stillum.registry.service.ArtifactVersionService;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;
import java.util.UUID;

@Path("/tenants/{tenantId}/artifacts/{artifactId}/versions")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ArtifactVersionResource {

    @Inject
    ArtifactVersionService service;

    @POST
    public Response create(
            @PathParam("tenantId") UUID tenantId,
            @PathParam("artifactId") UUID artifactId,
            @Valid CreateVersionRequest req) {
        ArtifactVersionResponse resp = service.create(tenantId, artifactId, req);
        return Response.status(Response.Status.CREATED).entity(resp).build();
    }

    @GET
    public Response list(
            @PathParam("tenantId") UUID tenantId,
            @PathParam("artifactId") UUID artifactId) {
        List<ArtifactVersionResponse> resp = service.listByArtifact(tenantId, artifactId);
        return Response.ok(resp).build();
    }

    @GET
    @Path("/{versionId}")
    public Response getById(
            @PathParam("tenantId") UUID tenantId,
            @PathParam("artifactId") UUID artifactId,
            @PathParam("versionId") UUID versionId) {
        return Response.ok(service.getById(tenantId, artifactId, versionId)).build();
    }

    @PUT
    @Path("/{versionId}")
    public Response update(
            @PathParam("tenantId") UUID tenantId,
            @PathParam("artifactId") UUID artifactId,
            @PathParam("versionId") UUID versionId,
            UpdateVersionRequest req) {
        return Response.ok(service.update(tenantId, artifactId, versionId, req)).build();
    }

    @DELETE
    @Path("/{versionId}")
    public Response delete(
            @PathParam("tenantId") UUID tenantId,
            @PathParam("artifactId") UUID artifactId,
            @PathParam("versionId") UUID versionId) {
        service.delete(tenantId, artifactId, versionId);
        return Response.noContent().build();
    }

    @PUT
    @Path("/{versionId}/payload-ref")
    public Response updatePayloadRef(
            @PathParam("tenantId") UUID tenantId,
            @PathParam("artifactId") UUID artifactId,
            @PathParam("versionId") UUID versionId,
            @Valid UpdatePayloadRefRequest req) {
        return Response.ok(service.updatePayloadRef(tenantId, artifactId, versionId, req)).build();
    }
}
