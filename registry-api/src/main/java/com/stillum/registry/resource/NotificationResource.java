package com.stillum.registry.resource;

import com.stillum.registry.entity.Notification;
import com.stillum.registry.filter.TenantContext;
import com.stillum.registry.service.NotificationService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;
import java.util.List;
import java.util.UUID;

@Path("/api/v1/tenants/{tenantId}/notifications")
@Produces(MediaType.APPLICATION_JSON)
@Tag(name = "Notifications")
public class NotificationResource {

    @Inject
    NotificationService notificationService;

    @Inject
    TenantContext tenantContext;

    @GET
    @Operation(summary = "List notifications")
    public Response listNotifications(
            @PathParam("tenantId") UUID tenantId,
            @QueryParam("userId") UUID userId,
            @QueryParam("unreadOnly") @DefaultValue("false") boolean unreadOnly,
            @QueryParam("page") @DefaultValue("0") int page,
            @QueryParam("size") @DefaultValue("20") int size) {
        if (!tenantId.equals(tenantContext.getTenantId())) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }
        
        List<Notification> notifications = notificationService.getUserNotifications(userId, unreadOnly, page, size);
        return Response.ok(notifications).build();
    }

    @PUT
    @Path("/{notificationId}/read")
    @Operation(summary = "Mark notification as read")
    public Response markAsRead(
            @PathParam("tenantId") UUID tenantId,
            @PathParam("notificationId") UUID notificationId) {
        if (!tenantId.equals(tenantContext.getTenantId())) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }
        
        notificationService.markAsRead(notificationId);
        return Response.noContent().build();
    }
}
