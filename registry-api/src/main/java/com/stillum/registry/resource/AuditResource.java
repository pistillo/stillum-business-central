package com.stillum.registry.resource;

import com.stillum.registry.entity.AuditLog;
import com.stillum.registry.filter.TenantContext;
import com.stillum.registry.service.AuditService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;
import java.util.List;
import java.util.UUID;

@Path("/api/v1/tenants/{tenantId}/audit")
@Produces(MediaType.APPLICATION_JSON)
@Tag(name = "Audit")
public class AuditResource {

    @Inject
    AuditService auditService;

    @Inject
    TenantContext tenantContext;

    @GET
    @Operation(summary = "List audit logs")
    public Response listAuditLogs(
            @PathParam("tenantId") UUID tenantId,
            @QueryParam("entityType") String entityType,
            @QueryParam("page") @DefaultValue("0") int page,
            @QueryParam("size") @DefaultValue("20") int size) {
        if (!tenantId.equals(tenantContext.getTenantId())) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }
        
        List<AuditLog> logs = auditService.getAuditLogs(tenantId, entityType, page, size);
        return Response.ok(logs).build();
    }
}
