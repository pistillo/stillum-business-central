package com.stillum.registry.resource;

import com.stillum.registry.entity.Task;
import com.stillum.registry.filter.TenantContext;
import com.stillum.registry.service.TaskService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;
import java.util.List;
import java.util.UUID;

@Path("/api/v1/tenants/{tenantId}/tasks")
@Produces(MediaType.APPLICATION_JSON)
@Tag(name = "Tasks")
public class TaskResource {

    @Inject
    TaskService taskService;

    @Inject
    TenantContext tenantContext;

    @GET
    @Operation(summary = "List user tasks")
    public Response listUserTasks(
            @PathParam("tenantId") UUID tenantId,
            @QueryParam("userId") UUID userId,
            @QueryParam("page") @DefaultValue("0") int page,
            @QueryParam("size") @DefaultValue("20") int size) {
        if (!tenantId.equals(tenantContext.getTenantId())) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }
        
        List<Task> tasks = taskService.getUserTasks(userId, page, size);
        return Response.ok(tasks).build();
    }

    @POST
    @Path("/{taskId}/complete")
    @Operation(summary = "Complete a task")
    public Response completeTask(
            @PathParam("tenantId") UUID tenantId,
            @PathParam("taskId") UUID taskId) {
        if (!tenantId.equals(tenantContext.getTenantId())) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }
        
        taskService.completeTask(taskId);
        return Response.noContent().build();
    }

    @POST
    @Path("/{taskId}/reassign")
    @Operation(summary = "Reassign task")
    public Response reassignTask(
            @PathParam("tenantId") UUID tenantId,
            @PathParam("taskId") UUID taskId,
            @QueryParam("assigneeId") UUID assigneeId) {
        if (!tenantId.equals(tenantContext.getTenantId())) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }
        
        taskService.reassignTask(taskId, assigneeId);
        return Response.noContent().build();
    }
}
