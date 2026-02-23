package com.stillum.registry.resource;

import com.stillum.registry.dto.request.CreateEnvironmentRequest;
import com.stillum.registry.dto.request.UpdateEnvironmentRequest;
import com.stillum.registry.dto.response.EnvironmentResponse;
import com.stillum.registry.service.EnvironmentService;
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

@Path("/tenants/{tenantId}/environments")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class EnvironmentResource {

    @Inject
    EnvironmentService service;

    @POST
    public Response create(
            @PathParam("tenantId") UUID tenantId,
            @Valid CreateEnvironmentRequest req) {
        EnvironmentResponse resp = service.create(tenantId, req);
        return Response.status(Response.Status.CREATED).entity(resp).build();
    }

    @GET
    public Response list(@PathParam("tenantId") UUID tenantId) {
        List<EnvironmentResponse> resp = service.list(tenantId);
        return Response.ok(resp).build();
    }

    @GET
    @Path("/{environmentId}")
    public Response getById(
            @PathParam("tenantId") UUID tenantId,
            @PathParam("environmentId") UUID environmentId) {
        return Response.ok(service.getById(tenantId, environmentId)).build();
    }

    @PUT
    @Path("/{environmentId}")
    public Response update(
            @PathParam("tenantId") UUID tenantId,
            @PathParam("environmentId") UUID environmentId,
            @Valid UpdateEnvironmentRequest req) {
        return Response.ok(service.update(tenantId, environmentId, req)).build();
    }

    @DELETE
    @Path("/{environmentId}")
    public Response delete(
            @PathParam("tenantId") UUID tenantId,
            @PathParam("environmentId") UUID environmentId) {
        service.delete(tenantId, environmentId);
        return Response.noContent().build();
    }
}
