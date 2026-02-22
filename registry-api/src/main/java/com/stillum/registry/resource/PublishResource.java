package com.stillum.registry.resource;

import com.stillum.registry.dto.PublishRequest;
import com.stillum.registry.dto.PublicationResponse;
import com.stillum.registry.entity.Publication;
import com.stillum.registry.filter.TenantContext;
import com.stillum.registry.service.PublisherService;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;
import java.util.UUID;

@Path("/api/v1/tenants/{tenantId}/publish")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Publications")
public class PublishResource {

    @Inject
    PublisherService publisherService;

    @Inject
    TenantContext tenantContext;

    @POST
    @Operation(summary = "Publish artifact version")
    public Response publish(
            @PathParam("tenantId") UUID tenantId,
            @Valid PublishRequest request) {
        if (!tenantId.equals(tenantContext.getTenantId())) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }
        
        UUID publisherId = UUID.randomUUID();
        Publication publication = publisherService.publish(request, publisherId);
        if (publication == null) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Version must be APPROVED").build();
        }
        return Response.status(Response.Status.CREATED).entity(publisherService.toPublicationResponse(publication)).build();
    }

    @GET
    @Path("/{publicationId}")
    @Operation(summary = "Get publication details")
    public Response getPublication(
            @PathParam("tenantId") UUID tenantId,
            @PathParam("publicationId") UUID publicationId) {
        if (!tenantId.equals(tenantContext.getTenantId())) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }
        
        Publication publication = publisherService.getPublication(publicationId);
        if (publication == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(publisherService.toPublicationResponse(publication)).build();
    }
}
