package com.stillum.registry.resource;

import com.stillum.registry.entity.Review;
import com.stillum.registry.filter.TenantContext;
import com.stillum.registry.service.ReviewService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;
import java.util.UUID;

@Path("/api/v1/tenants/{tenantId}/reviews")
@Produces(MediaType.APPLICATION_JSON)
@Tag(name = "Reviews")
public class ReviewResource {

    @Inject
    ReviewService reviewService;

    @Inject
    TenantContext tenantContext;

    @POST
    @Operation(summary = "Assign reviewer")
    public Response assignReviewer(
            @PathParam("tenantId") UUID tenantId,
            @QueryParam("versionId") UUID versionId,
            @QueryParam("reviewerId") UUID reviewerId) {
        if (!tenantId.equals(tenantContext.getTenantId())) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }
        
        Review review = reviewService.assignReviewer(versionId, reviewerId);
        if (review == null) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Version must be in REVIEW state").build();
        }
        return Response.status(Response.Status.CREATED).entity(review).build();
    }

    @POST
    @Path("/{reviewId}/approve")
    @Operation(summary = "Approve version")
    public Response approve(
            @PathParam("tenantId") UUID tenantId,
            @PathParam("reviewId") UUID reviewId,
            @QueryParam("comment") String comment) {
        if (!tenantId.equals(tenantContext.getTenantId())) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }
        
        Review review = reviewService.approveReview(reviewId, comment);
        if (review == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(review).build();
    }

    @POST
    @Path("/{reviewId}/reject")
    @Operation(summary = "Reject version")
    public Response reject(
            @PathParam("tenantId") UUID tenantId,
            @PathParam("reviewId") UUID reviewId,
            @QueryParam("comment") String comment) {
        if (!tenantId.equals(tenantContext.getTenantId())) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }
        
        Review review = reviewService.rejectReview(reviewId, comment);
        if (review == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(review).build();
    }
}
