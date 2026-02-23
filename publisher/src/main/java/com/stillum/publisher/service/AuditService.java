package com.stillum.publisher.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.stillum.publisher.entity.AuditLog;
import com.stillum.publisher.repository.AuditLogRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import java.time.OffsetDateTime;
import java.util.Map;
import java.util.UUID;

@ApplicationScoped
public class AuditService {

    @Inject
    AuditLogRepository repo;

    @Inject
    ObjectMapper mapper;

    @Transactional(Transactional.TxType.REQUIRES_NEW)
    public void publishSuccess(
            UUID tenantId,
            UUID publicationId,
            UUID artifactId,
            UUID versionId,
            UUID environmentId,
            String bundleRef) {
        write(tenantId, "publication", publicationId, "PUBLISH_SUCCESS", Map.of(
                "artifactId", artifactId,
                "versionId", versionId,
                "environmentId", environmentId,
                "bundleRef", bundleRef
        ));
    }

    @Transactional(Transactional.TxType.REQUIRES_NEW)
    public void publishFailure(
            UUID tenantId,
            UUID artifactId,
            UUID versionId,
            UUID environmentId,
            String error) {
        write(tenantId, "publication", null, "PUBLISH_FAILURE", Map.of(
                "artifactId", artifactId,
                "versionId", versionId,
                "environmentId", environmentId,
                "error", error
        ));
    }

    private void write(
            UUID tenantId,
            String entityType,
            UUID entityId,
            String action,
            Map<String, Object> details) {
        AuditLog log = new AuditLog();
        log.tenantId = tenantId;
        log.entityType = entityType;
        log.entityId = entityId;
        log.action = action;
        log.timestamp = OffsetDateTime.now();
        JsonNode node = mapper.valueToTree(details);
        log.details = node;
        repo.persist(log);
    }
}
