package com.stillum.registry.resource;

import com.stillum.registry.entity.User;
import com.stillum.registry.filter.TenantContext;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Path("/api/v1/tenants/{tenantId}/users")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Users")
public class UserResource {

    @Inject
    TenantContext tenantContext;

    @GET
    @Operation(summary = "List users")
    public Response listUsers(@PathParam("tenantId") UUID tenantId) {
        if (!tenantId.equals(tenantContext.getTenantId())) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }
        
        List<User> users = User.find("tenantId", tenantId).list();
        return Response.ok(users).build();
    }

    @POST
    @Operation(summary = "Create/invite user")
    public Response createUser(@PathParam("tenantId") UUID tenantId, User user) {
        if (!tenantId.equals(tenantContext.getTenantId())) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }
        
        user.tenantId = tenantId;
        user.createdAt = LocalDateTime.now();
        user.updatedAt = LocalDateTime.now();
        user.persist();
        return Response.status(Response.Status.CREATED).entity(user).build();
    }

    @PUT
    @Path("/{userId}/roles")
    @Operation(summary = "Update user roles")
    public Response updateUserRoles(
            @PathParam("tenantId") UUID tenantId,
            @PathParam("userId") UUID userId,
            @QueryParam("roleId") UUID roleId) {
        if (!tenantId.equals(tenantContext.getTenantId())) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }
        
        User user = User.findById(userId);
        if (user == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        user.roleId = roleId;
        user.updatedAt = LocalDateTime.now();
        user.persist();
        return Response.ok(user).build();
    }
}
