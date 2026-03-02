package com.stillum.registry.resource;

import com.stillum.registry.dto.request.CreateArtifactRequest;
import com.stillum.registry.dto.request.CreateComponentRequest;
import com.stillum.registry.dto.request.CreateModuleRequest;
import com.stillum.registry.dto.request.UpdateArtifactRequest;
import com.stillum.registry.dto.response.ArtifactResponse;
import com.stillum.registry.dto.response.PagedResponse;
import com.stillum.registry.entity.enums.ArtifactStatus;
import com.stillum.registry.entity.enums.ArtifactType;
import com.stillum.registry.service.ArtifactService;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.UUID;

@Path("/tenants/{tenantId}/artifacts")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ArtifactResource {

    @Inject
    ArtifactService service;

    @POST
    public Response create(
            @PathParam("tenantId") UUID tenantId,
            @Valid CreateArtifactRequest req) {
        ArtifactResponse resp = service.create(tenantId, req);
        return Response.status(Response.Status.CREATED).entity(resp).build();
    }

    @GET
    public Response list(
            @PathParam("tenantId") UUID tenantId,
            @QueryParam("type") ArtifactType type,
            @QueryParam("status") ArtifactStatus status,
            @QueryParam("area") String area,
            @QueryParam("tag") String tag,
            @QueryParam("page") @DefaultValue("0") int page,
            @QueryParam("size") @DefaultValue("20") int size) {
        PagedResponse<ArtifactResponse> resp = service.list(
                tenantId, type, status, area, tag, page, size);
        return Response.ok(resp).build();
    }

    @GET
    @Path("/{artifactId}")
    public Response getById(
            @PathParam("tenantId") UUID tenantId,
            @PathParam("artifactId") UUID artifactId) {
        return Response.ok(service.getById(tenantId, artifactId)).build();
    }

    @PUT
    @Path("/{artifactId}")
    public Response update(
            @PathParam("tenantId") UUID tenantId,
            @PathParam("artifactId") UUID artifactId,
            @Valid UpdateArtifactRequest req) {
        return Response.ok(service.update(tenantId, artifactId, req)).build();
    }

    @DELETE
    @Path("/{artifactId}")
    public Response retire(
            @PathParam("tenantId") UUID tenantId,
            @PathParam("artifactId") UUID artifactId) {
        service.retire(tenantId, artifactId);
        return Response.noContent().build();
    }

    @POST
    @Path("/modules")
    public Response createModule(
            @PathParam("tenantId") UUID tenantId,
            @Valid CreateModuleRequest req) {
        ArtifactResponse resp = service.createModule(tenantId, req);
        return Response.status(Response.Status.CREATED).entity(resp).build();
    }

    @POST
    @Path("/components")
    public Response createComponent(
            @PathParam("tenantId") UUID tenantId,
            @Valid CreateComponentRequest req) {
        ArtifactResponse resp = service.createComponent(tenantId, req);
        return Response.status(Response.Status.CREATED).entity(resp).build();
    }
}
