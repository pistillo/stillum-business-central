package com.stillum.publisher.resource;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/health")
@Produces(MediaType.APPLICATION_JSON)
public class HealthResource {

    @GET
    public Response health() {
        return Response.ok("{\"status\":\"UP\"}").build();
    }

    @GET
    @Path("/ready")
    public Response ready() {
        return Response.ok("{\"status\":\"READY\"}").build();
    }
}
