package com.stillum.registry.resource;

import com.stillum.registry.dto.ArtifactResponse;
import com.stillum.registry.dto.PagedResponse;
import com.stillum.registry.entity.Artifact;
import com.stillum.registry.filter.TenantContext;
import com.stillum.registry.service.ArtifactService;
import com.stillum.registry.service.SearchService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;
import java.util.List;
import java.util.UUID;

@Path("/api/v1/tenants/{tenantId}/search")
@Produces(MediaType.APPLICATION_JSON)
@Tag(name = "Search")
public class SearchResource {

    @Inject
    SearchService searchService;

    @Inject
    ArtifactService artifactService;

    @Inject
    TenantContext tenantContext;

    @GET
    @Path("/artifacts")
    @Operation(summary = "Full text search artifacts")
    public Response searchArtifacts(
            @PathParam("tenantId") UUID tenantId,
            @QueryParam("q") String query,
            @QueryParam("page") @DefaultValue("0") int page,
            @QueryParam("size") @DefaultValue("20") int size) {
        if (!tenantId.equals(tenantContext.getTenantId())) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }
        
        List<Artifact> artifacts = searchService.fullTextSearch(tenantId, query, page, size);
        long total = searchService.countSearchResults(tenantId, query);
        
        List<ArtifactResponse> responses = artifacts.stream()
            .map(artifact -> {
                ArtifactResponse response = new ArtifactResponse();
                response.id = artifact.id;
                response.tenantId = artifact.tenantId;
                response.type = artifact.type;
                response.title = artifact.title;
                response.description = artifact.description;
                response.ownerId = artifact.ownerId;
                response.status = artifact.status;
                response.tags = artifact.tags;
                response.area = artifact.area;
                response.createdAt = artifact.createdAt;
                response.updatedAt = artifact.updatedAt;
                response.deleted = artifact.deleted;
                return response;
            })
            .toList();
        
        PagedResponse<ArtifactResponse> response = new PagedResponse<>(responses, page, size, total);
        return Response.ok(response).build();
    }
}
