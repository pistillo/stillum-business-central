package com.stillum.registry.resource;

import com.stillum.registry.dto.response.PresignedUrlResponse;
import com.stillum.registry.service.StorageService;
import jakarta.inject.Inject;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.UUID;

@Path("/tenants/{tenantId}/storage")
@Produces(MediaType.APPLICATION_JSON)
public class StorageResource {

    @Inject
    StorageService service;

    @GET
    @Path("/upload-url")
    public Response uploadUrl(
            @PathParam("tenantId") UUID tenantId,
            @QueryParam("artifactId") UUID artifactId,
            @QueryParam("versionId") UUID versionId,
            @QueryParam("contentType") @DefaultValue("application/octet-stream") String contentType) {
        PresignedUrlResponse resp =
                service.generateUploadUrl(tenantId, artifactId, versionId, contentType);
        return Response.ok(resp).build();
    }

    @GET
    @Path("/download-url")
    public Response downloadUrl(
            @PathParam("tenantId") UUID tenantId,
            @QueryParam("artifactId") UUID artifactId,
            @QueryParam("versionId") UUID versionId) {
        PresignedUrlResponse resp =
                service.generateDownloadUrl(tenantId, artifactId, versionId);
        return Response.ok(resp).build();
    }

    @GET
    @Path("/bundle-upload-url")
    public Response bundleUploadUrl(
            @PathParam("tenantId") UUID tenantId,
            @QueryParam("artifactId") UUID artifactId,
            @QueryParam("versionId") UUID versionId,
            @QueryParam("contentType") @DefaultValue("application/zip") String contentType) {
        PresignedUrlResponse resp =
                service.generateBundleUploadUrl(tenantId, artifactId, versionId, contentType);
        return Response.ok(resp).build();
    }

    @GET
    @Path("/bundle-download-url")
    public Response bundleDownloadUrl(
            @PathParam("tenantId") UUID tenantId,
            @QueryParam("artifactId") UUID artifactId,
            @QueryParam("versionId") UUID versionId) {
        PresignedUrlResponse resp =
                service.generateBundleDownloadUrl(tenantId, artifactId, versionId);
        return Response.ok(resp).build();
    }
}
