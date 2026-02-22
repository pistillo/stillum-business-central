package com.stillum.registry.filter;

import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.core.PathSegment;
import jakarta.ws.rs.ext.Provider;
import java.util.List;
import java.util.UUID;

@Provider
public class TenantFilter implements ContainerRequestFilter {

    private final TenantContext tenantContext;

    public TenantFilter(TenantContext tenantContext) {
        this.tenantContext = tenantContext;
    }

    @Override
    public void filter(ContainerRequestContext requestContext) {
        String path = requestContext.getUriInfo().getPath();
        
        if (path.contains("/api/v1/tenants/")) {
            List<PathSegment> pathSegments = requestContext.getUriInfo().getPathSegments();
            
            for (int i = 0; i < pathSegments.size() - 1; i++) {
                if ("tenants".equals(pathSegments.get(i).getPath())) {
                    try {
                        String tenantIdStr = pathSegments.get(i + 1).getPath();
                        UUID tenantId = UUID.fromString(tenantIdStr);
                        tenantContext.setTenantId(tenantId);
                        break;
                    } catch (IllegalArgumentException e) {
                        // Not a valid UUID, skip
                    }
                }
            }
        }
    }
}
