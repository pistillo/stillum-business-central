package com.stillum.gateway.resource;

import com.stillum.gateway.dto.WorkflowRequest;
import com.stillum.gateway.dto.WorkflowResponse;
import com.stillum.gateway.service.InstanceService;
import com.stillum.gateway.service.WorkflowService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.Map;

@Path("/api/v1/tenants/{tenantId}/instances")
@Produces(MediaType.APPLICATION_JSON)
public class InstanceResource {

    @Inject
    WorkflowService workflowService;

    @Inject
    InstanceService instanceService;

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response startInstance(@PathParam("tenantId") String tenantId, WorkflowRequest request) {
        try {
            WorkflowResponse response = workflowService.startWorkflow(request, tenantId);
            return Response.status(Response.Status.CREATED).entity(response).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"error\": \"" + e.getMessage() + "\"}").build();
        }
    }

    @GET
    @Path("/{instanceId}")
    public Response getInstance(@PathParam("tenantId") String tenantId,
                                @PathParam("instanceId") String instanceId) {
        try {
            Map<String, Object> instance = instanceService.getInstanceDetails(instanceId, tenantId);
            return Response.ok(instance).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"error\": \"" + e.getMessage() + "\"}").build();
        }
    }

    @PUT
    @Path("/{instanceId}/pause")
    public Response pauseInstance(@PathParam("tenantId") String tenantId,
                                  @PathParam("instanceId") String instanceId) {
        try {
            instanceService.pauseInstance(instanceId, tenantId);
            return Response.ok("{\"status\": \"PAUSED\"}").build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"error\": \"" + e.getMessage() + "\"}").build();
        }
    }

    @PUT
    @Path("/{instanceId}/resume")
    public Response resumeInstance(@PathParam("tenantId") String tenantId,
                                   @PathParam("instanceId") String instanceId) {
        try {
            instanceService.resumeInstance(instanceId, tenantId);
            return Response.ok("{\"status\": \"RUNNING\"}").build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"error\": \"" + e.getMessage() + "\"}").build();
        }
    }

    @DELETE
    @Path("/{instanceId}")
    public Response abortInstance(@PathParam("tenantId") String tenantId,
                                  @PathParam("instanceId") String instanceId,
                                  @QueryParam("reason") String reason) {
        try {
            instanceService.abortInstance(instanceId, reason != null ? reason : "User abort", tenantId);
            return Response.ok("{\"status\": \"ABORTED\"}").build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"error\": \"" + e.getMessage() + "\"}").build();
        }
    }
}
