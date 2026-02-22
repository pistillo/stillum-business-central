package com.stillum.publisher.resource;

import com.stillum.publisher.dto.PublishRequest;
import com.stillum.publisher.dto.PublishResponse;
import com.stillum.publisher.service.PublishService;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/api/v1/tenants/{tenantId}/publish")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class PublishResource {

    @Inject
    PublishService publishService;

    @POST
    public Response publish(@PathParam("tenantId") String tenantId, @Valid PublishRequest request) {
        try {
            byte[] payload = request.getPayload() != null ? request.getPayload().getBytes() : new byte[0];
            PublishResponse response = publishService.publish(request, tenantId, payload);

            if ("PUBLISHED".equals(response.getStatus())) {
                return Response.status(Response.Status.CREATED).entity(response).build();
            } else if ("VALIDATION_FAILED".equals(response.getStatus())) {
                return Response.status(Response.Status.BAD_REQUEST).entity(response).build();
            } else {
                return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(response).build();
            }
        } catch (Exception e) {
            PublishResponse errorResponse = new PublishResponse();
            errorResponse.setStatus("ERROR");
            errorResponse.setMessage(e.getMessage());
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorResponse).build();
        }
    }

    @GET
    @Path("/{publicationId}")
    public Response getPublication(@PathParam("tenantId") String tenantId,
                                   @PathParam("publicationId") String publicationId) {
        PublishResponse response = new PublishResponse();
        response.setPublicationId(publicationId);
        response.setStatus("PUBLISHED");
        return Response.ok(response).build();
    }
}
