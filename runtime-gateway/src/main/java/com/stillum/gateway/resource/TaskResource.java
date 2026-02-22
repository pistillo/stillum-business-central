package com.stillum.gateway.resource;

import com.stillum.gateway.dto.TaskRequest;
import com.stillum.gateway.service.TaskService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.Map;

@Path("/api/v1/tenants/{tenantId}/tasks")
@Produces(MediaType.APPLICATION_JSON)
public class TaskResource {

    @Inject
    TaskService taskService;

    @GET
    @Path("/{taskId}")
    public Response getTask(@PathParam("tenantId") String tenantId,
                            @PathParam("taskId") String taskId) {
        try {
            Map<String, Object> task = taskService.getTask(taskId, tenantId);
            return Response.ok(task).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"error\": \"" + e.getMessage() + "\"}").build();
        }
    }

    @POST
    @Path("/{taskId}/submit")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response submitTask(@PathParam("tenantId") String tenantId,
                               @PathParam("taskId") String taskId,
                               TaskRequest request) {
        try {
            taskService.submitTask(taskId, request, tenantId);
            return Response.ok("{\"status\": \"SUBMITTED\"}").build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"error\": \"" + e.getMessage() + "\"}").build();
        }
    }

    @POST
    @Path("/{taskId}/complete")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response completeTask(@PathParam("tenantId") String tenantId,
                                 @PathParam("taskId") String taskId,
                                 TaskRequest request) {
        try {
            taskService.completeTask(taskId, request, tenantId);
            return Response.ok("{\"status\": \"COMPLETED\"}").build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"error\": \"" + e.getMessage() + "\"}").build();
        }
    }

    @POST
    @Path("/{taskId}/reject")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response rejectTask(@PathParam("tenantId") String tenantId,
                               @PathParam("taskId") String taskId,
                               @QueryParam("reason") String reason) {
        try {
            taskService.rejectTask(taskId, reason != null ? reason : "Rejected by user", tenantId);
            return Response.ok("{\"status\": \"REJECTED\"}").build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"error\": \"" + e.getMessage() + "\"}").build();
        }
    }

    @POST
    @Path("/{taskId}/claim")
    public Response claimTask(@PathParam("tenantId") String tenantId,
                              @PathParam("taskId") String taskId,
                              @QueryParam("userId") String userId) {
        try {
            taskService.claimTask(taskId, userId, tenantId);
            return Response.ok("{\"status\": \"CLAIMED\"}").build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"error\": \"" + e.getMessage() + "\"}").build();
        }
    }

    @POST
    @Path("/{taskId}/unclaim")
    public Response unclaimTask(@PathParam("tenantId") String tenantId,
                                @PathParam("taskId") String taskId) {
        try {
            taskService.unclaimTask(taskId, tenantId);
            return Response.ok("{\"status\": \"UNCLAIMED\"}").build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"error\": \"" + e.getMessage() + "\"}").build();
        }
    }
}
