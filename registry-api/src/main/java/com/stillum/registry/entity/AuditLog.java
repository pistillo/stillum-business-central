package com.stillum.registry.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "audit_logs")
public class AuditLog extends PanacheEntityBase {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "UUID")
    public UUID id;

    @Column(name = "tenant_id", nullable = false, columnDefinition = "UUID")
    public UUID tenantId;

    @Column(name = "entity_type", nullable = false, length = 100)
    public String entityType;

    @Column(name = "entity_id", columnDefinition = "UUID")
    public UUID entityId;

    @Column(nullable = false, length = 50)
    public String action;

    @Column(name = "actor_id", columnDefinition = "UUID")
    public UUID actorId;

    @Column(nullable = false, columnDefinition = "TIMESTAMP")
    public LocalDateTime timestamp;

    @Column(columnDefinition = "TEXT")
    public String details;

    @PrePersist
    protected void onCreate() {
        if (timestamp == null) {
            timestamp = LocalDateTime.now();
        }
    }
}
