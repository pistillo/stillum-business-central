package com.stillum.registry.entity;

import com.stillum.registry.entity.enums.InstanceStatus;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "instances")
public class Instance extends PanacheEntityBase {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "UUID")
    public UUID id;

    @Column(name = "tenant_id", nullable = false, columnDefinition = "UUID")
    public UUID tenantId;

    @Column(name = "artifact_version_id", nullable = false, columnDefinition = "UUID")
    public UUID artifactVersionId;

    @Column(name = "correlation_key", length = 255)
    public String correlationKey;

    @Column(name = "business_key", length = 255)
    public String businessKey;

    @Column(nullable = false, columnDefinition = "VARCHAR(50)")
    @Enumerated(EnumType.STRING)
    public InstanceStatus status;

    @Column(name = "started_at", columnDefinition = "TIMESTAMP")
    public LocalDateTime startedAt;

    @Column(name = "ended_at", columnDefinition = "TIMESTAMP")
    public LocalDateTime endedAt;

    @PrePersist
    protected void onCreate() {
        if (status == null) {
            status = InstanceStatus.RUNNING;
        }
        if (startedAt == null) {
            startedAt = LocalDateTime.now();
        }
    }
}
