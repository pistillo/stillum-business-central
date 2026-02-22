package com.stillum.registry.resource;

import com.stillum.registry.dto.*;
import com.stillum.registry.entity.ArtifactVersion;
import com.stillum.registry.filter.TenantContext;
import com.stillum.registry.service.VersionService;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;
import java.util.UUID;

@Path("/api/v1/tenants/{tenantId}/artifacts/{artifactId}/versions")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Versions")
public class VersionResource {

    @Inject
    VersionService versionService;

    @Inject
    TenantContext tenantContext;

    @POST
    @Operation(summary = "Create a new version")
    public Response createVersion(
            @PathParam("tenantId") UUID tenantId,
            @PathParam("artifactId") UUID artifactId,
            @Valid CreateVersionRequest request) {
        if (!tenantId.equals(tenantContext.getTenantId())) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }
        
        UUID userId = UUID.randomUUID();
        ArtifactVersion version = versionService.createVersion(artifactId, userId, request);
        return Response.status(Response.Status.CREATED).entity(versionService.toVersionResponse(version)).build();
    }

    @GET
    @Path("/{versionId}")
    @Operation(summary = "Get version details")
    public Response getVersion(
            @PathParam("tenantId") UUID tenantId,
            @PathParam("artifactId") UUID artifactId,
            @PathParam("versionId") UUID versionId) {
        if (!tenantId.equals(tenantContext.getTenantId())) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }
        
        ArtifactVersion version = versionService.getVersion(versionId);
        if (version == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(versionService.toVersionResponse(version)).build();
    }

    @PUT
    @Path("/{versionId}")
    @Operation(summary = "Update draft version")
    public Response updateVersion(
            @PathParam("tenantId") UUID tenantId,
            @PathParam("artifactId") UUID artifactId,
            @PathParam("versionId") UUID versionId,
            @Valid UpdateVersionRequest request) {
        if (!tenantId.equals(tenantContext.getTenantId())) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }
        
        ArtifactVersion version = versionService.updateVersion(versionId, request);
        if (version == null) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Version must be in DRAFT state").build();
        }
        return Response.ok(versionService.toVersionResponse(version)).build();
    }

    @DELETE
    @Path("/{versionId}")
    @Operation(summary = "Delete draft version only")
    public Response deleteVersion(
            @PathParam("tenantId") UUID tenantId,
            @PathParam("artifactId") UUID artifactId,
            @PathParam("versionId") UUID versionId) {
        if (!tenantId.equals(tenantContext.getTenantId())) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }
        
        versionService.deleteVersion(versionId);
        return Response.noContent().build();
    }

    @POST
    @Path("/{versionId}/transition")
    @Operation(summary = "Transition version state")
    public Response transitionState(
            @PathParam("tenantId") UUID tenantId,
            @PathParam("artifactId") UUID artifactId,
            @PathParam("versionId") UUID versionId,
            @Valid TransitionRequest request) {
        if (!tenantId.equals(tenantContext.getTenantId())) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }
        
        ArtifactVersion version = versionService.transitionState(versionId, request.targetState);
        if (version == null) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Invalid state transition").build();
        }
        return Response.ok(versionService.toVersionResponse(version)).build();
    }
}
