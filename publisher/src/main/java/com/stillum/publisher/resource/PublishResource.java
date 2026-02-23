package com.stillum.publisher.resource;

import com.stillum.publisher.dto.request.PublishRequest;
import com.stillum.publisher.dto.response.PublicationResponse;
import com.stillum.publisher.service.PublishService;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.UUID;

@Path("/tenants/{tenantId}/publish")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class PublishResource {

    @Inject
    PublishService service;

    @POST
    public Response publish(
            @PathParam("tenantId") UUID tenantId,
            @Valid PublishRequest req) {
        PublicationResponse resp = service.publish(tenantId, req);
        return Response.status(Response.Status.CREATED).entity(resp).build();
    }

    @GET
    @Path("/{publicationId}")
    public Response getById(
            @PathParam("tenantId") UUID tenantId,
            @PathParam("publicationId") UUID publicationId) {
        PublicationResponse resp = service.getPublication(tenantId, publicationId);
        return Response.ok(resp).build();
    }
}

