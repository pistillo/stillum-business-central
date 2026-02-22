package com.stillum.publisher.resource;

import com.stillum.publisher.service.StorageClient;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/api/v1/tenants/{tenantId}/storage")
@Produces(MediaType.APPLICATION_JSON)
public class StorageResource {

    @Inject
    StorageClient storageClient;

    @POST
    @Path("/presigned-upload")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response generatePresignedUploadUrl(@PathParam("tenantId") String tenantId,
                                                PresignedUrlRequest request) {
        try {
            String url = storageClient.generatePresignedUploadUrl(request.getPath());
            PresignedUrlResponse response = new PresignedUrlResponse();
            response.setUrl(url);
            response.setExpires(900); // 15 minutes in seconds
            return Response.ok(response).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(new ErrorResponse(e.getMessage()))
                    .build();
        }
    }

    @POST
    @Path("/presigned-download")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response generatePresignedDownloadUrl(@PathParam("tenantId") String tenantId,
                                                  PresignedUrlRequest request) {
        try {
            String url = storageClient.generatePresignedDownloadUrl(request.getPath());
            PresignedUrlResponse response = new PresignedUrlResponse();
            response.setUrl(url);
            response.setExpires(900); // 15 minutes in seconds
            return Response.ok(response).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(new ErrorResponse(e.getMessage()))
                    .build();
        }
    }

    public static class PresignedUrlRequest {
        private String path;

        public String getPath() {
            return path;
        }

        public void setPath(String path) {
            this.path = path;
        }
    }

    public static class PresignedUrlResponse {
        private String url;
        private int expires;

        public String getUrl() {
            return url;
        }

        public void setUrl(String url) {
            this.url = url;
        }

        public int getExpires() {
            return expires;
        }

        public void setExpires(int expires) {
            this.expires = expires;
        }
    }

    public static class ErrorResponse {
        private String message;

        public ErrorResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }
}
