package com.stillum.publisher.exception;

import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;
import java.util.Map;

@Provider
public class GlobalExceptionMapper implements ExceptionMapper<RuntimeException> {

    @Override
    public Response toResponse(RuntimeException ex) {
        if (ex instanceof WebApplicationException wae) {
            return wae.getResponse();
        }
        if (ex instanceof NotFoundException) {
            return error(Response.Status.NOT_FOUND, ex.getMessage());
        }
        if (ex instanceof ConflictException) {
            return error(Response.Status.CONFLICT, ex.getMessage());
        }
        if (ex instanceof IllegalArgumentException) {
            return error(Response.Status.BAD_REQUEST, ex.getMessage());
        }
        return error(Response.Status.INTERNAL_SERVER_ERROR, "Internal server error");
    }

    private Response error(Response.Status status, String message) {
        return Response.status(status)
                .type(MediaType.APPLICATION_JSON)
                .entity(Map.of("error", message, "status", status.getStatusCode()))
                .build();
    }
}

