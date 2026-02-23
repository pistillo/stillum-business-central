package com.stillum.publisher.entity;

import com.fasterxml.jackson.databind.JsonNode;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;
import java.util.UUID;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UuidGenerator;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "audit_log")
public class AuditLog extends PanacheEntityBase {

    @Id
    @GeneratedValue
    @UuidGenerator
    @Column(columnDefinition = "uuid", updatable = false)
    public UUID id;

    @Column(name = "tenant_id", nullable = false)
    public UUID tenantId;

    @Column(name = "entity_type", nullable = false)
    public String entityType;

    @Column(name = "entity_id")
    public UUID entityId;

    @Column(nullable = false)
    public String action;

    @Column(name = "actor_id")
    public UUID actorId;

    @Column(name = "timestamp", updatable = false)
    public OffsetDateTime timestamp;

    @JdbcTypeCode(SqlTypes.JSON)
    public JsonNode details;
}

