package com.stillum.registry.context;

import jakarta.enterprise.context.RequestScoped;
import java.util.UUID;

@RequestScoped
public class TenantContext {

    private UUID tenantId;

    public void set(UUID id) {
        this.tenantId = id;
    }

    public UUID get() {
        return tenantId;
    }

    public boolean isSet() {
        return tenantId != null;
    }
}
