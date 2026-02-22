package com.stillum.registry.filter;

import jakarta.enterprise.context.RequestScoped;
import java.util.UUID;

@RequestScoped
public class TenantContext {
    
    private UUID tenantId;

    public UUID getTenantId() {
        return tenantId;
    }

    public void setTenantId(UUID tenantId) {
        this.tenantId = tenantId;
    }
}
