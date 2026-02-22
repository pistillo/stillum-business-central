package com.stillum.registry.service;

import com.stillum.registry.entity.AuditLog;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class AuditService {

    @Transactional
    public void log(UUID tenantId, String entityType, UUID entityId, String action, UUID actorId, String details) {
        AuditLog auditLog = new AuditLog();
        auditLog.tenantId = tenantId;
        auditLog.entityType = entityType;
        auditLog.entityId = entityId;
        auditLog.action = action;
        auditLog.actorId = actorId;
        auditLog.timestamp = LocalDateTime.now();
        auditLog.details = details;
        auditLog.persist();
    }

    public List<AuditLog> getAuditLogs(UUID tenantId, String entityType, int page, int size) {
        String query = "tenantId = ?1";
        Object[] params = {tenantId};
        
        if (entityType != null && !entityType.isEmpty()) {
            query += " and entityType = ?";
            Object[] newParams = new Object[params.length + 1];
            System.arraycopy(params, 0, newParams, 0, params.length);
            newParams[params.length] = entityType;
            params = newParams;
        }
        
        return AuditLog.find(query + " order by timestamp desc", params)
            .page(page, size)
            .list();
    }
}
