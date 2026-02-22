package com.stillum.registry.resource;

import com.stillum.registry.dto.*;
import com.stillum.registry.entity.Artifact;
import com.stillum.registry.filter.TenantContext;
import com.stillum.registry.service.ArtifactService;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;
import java.util.UUID;

@Path("/api/v1/tenants/{tenantId}/artifacts")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Artifacts")
public class ArtifactResource {

    @Inject
    ArtifactService artifactService;

    @Inject
    TenantContext tenantContext;

    @POST
    @Operation(summary = "Create a new artifact")
    public Response createArtifact(
            @PathParam("tenantId") UUID tenantId,
            @Valid CreateArtifactRequest request) {
        if (!tenantId.equals(tenantContext.getTenantId())) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }
        
        UUID userId = UUID.randomUUID(); // In production, get from security context
        Artifact artifact = artifactService.createArtifact(tenantId, userId, request);
        return Response.status(Response.Status.CREATED).entity(artifact).build();
    }

    @GET
    @Operation(summary = "List artifacts with filters")
    public Response listArtifacts(
            @PathParam("tenantId") UUID tenantId,
            @QueryParam("type") String type,
            @QueryParam("status") String status,
            @QueryParam("tag") String tag,
            @QueryParam("area") String area,
            @QueryParam("page") @DefaultValue("0") int page,
            @QueryParam("size") @DefaultValue("20") int size) {
        if (!tenantId.equals(tenantContext.getTenantId())) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }
        
        SearchRequest request = new SearchRequest();
        request.page = page;
        request.size = size;
        
        PagedResponse<ArtifactResponse> response = artifactService.listArtifacts(tenantId, request);
        return Response.ok(response).build();
    }

    @GET
    @Path("/{artifactId}")
    @Operation(summary = "Get artifact by ID")
    public Response getArtifact(
            @PathParam("tenantId") UUID tenantId,
            @PathParam("artifactId") UUID artifactId) {
        if (!tenantId.equals(tenantContext.getTenantId())) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }
        
        Artifact artifact = artifactService.getArtifact(artifactId);
        if (artifact == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(artifact).build();
    }

    @PUT
    @Path("/{artifactId}")
    @Operation(summary = "Update artifact metadata")
    public Response updateArtifact(
            @PathParam("tenantId") UUID tenantId,
            @PathParam("artifactId") UUID artifactId,
            @Valid UpdateArtifactRequest request) {
        if (!tenantId.equals(tenantContext.getTenantId())) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }
        
        Artifact artifact = artifactService.updateArtifact(artifactId, request);
        if (artifact == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(artifact).build();
    }

    @DELETE
    @Path("/{artifactId}")
    @Operation(summary = "Soft delete an artifact")
    public Response deleteArtifact(
            @PathParam("tenantId") UUID tenantId,
            @PathParam("artifactId") UUID artifactId) {
        if (!tenantId.equals(tenantContext.getTenantId())) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }
        
        artifactService.deleteArtifact(artifactId);
        return Response.noContent().build();
    }
}
