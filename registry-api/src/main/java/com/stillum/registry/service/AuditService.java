package com.stillum.registry.service;

import com.stillum.registry.entity.AuditLog;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
        StringBuilder queryBuilder = new StringBuilder("tenantId = :tenantId");
        Map<String, Object> params = new HashMap<>();
        params.put("tenantId", tenantId);

        if (entityType != null && !entityType.isEmpty()) {
            queryBuilder.append(" and entityType = :entityType");
            params.put("entityType", entityType);
        }

        return AuditLog.find(queryBuilder.toString() + " order by timestamp desc", params)
                .page(page, size)
                .list();
    }
}
