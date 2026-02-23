package com.stillum.registry.resource;

import com.stillum.registry.dto.response.ArtifactResponse;
import com.stillum.registry.dto.response.PagedResponse;
import com.stillum.registry.entity.enums.ArtifactStatus;
import com.stillum.registry.entity.enums.ArtifactType;
import com.stillum.registry.service.SearchService;
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

@Path("/tenants/{tenantId}/search/artifacts")
@Produces(MediaType.APPLICATION_JSON)
public class SearchResource {

    @Inject
    SearchService service;

    @GET
    public Response search(
            @PathParam("tenantId") UUID tenantId,
            @QueryParam("q") String query,
            @QueryParam("type") ArtifactType type,
            @QueryParam("status") ArtifactStatus status,
            @QueryParam("area") String area,
            @QueryParam("tag") String tag,
            @QueryParam("page") @DefaultValue("0") int page,
            @QueryParam("size") @DefaultValue("20") int size) {
        PagedResponse<ArtifactResponse> resp =
                service.search(tenantId, query, type, status, area, tag, page, size);
        return Response.ok(resp).build();
    }
}
