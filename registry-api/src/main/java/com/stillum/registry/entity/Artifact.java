package com.stillum.registry.entity;

import com.stillum.registry.entity.enums.ArtifactStatus;
import com.stillum.registry.entity.enums.ArtifactType;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "artifacts")
public class Artifact extends PanacheEntityBase {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "UUID")
    public UUID id;

    @Column(name = "tenant_id", nullable = false, columnDefinition = "UUID")
    public UUID tenantId;

    @Column(nullable = false, columnDefinition = "VARCHAR(50)")
    @Enumerated(EnumType.STRING)
    public ArtifactType type;

    @Column(nullable = false, length = 255)
    public String title;

    @Column(columnDefinition = "TEXT")
    public String description;

    @Column(name = "owner_id", columnDefinition = "UUID")
    public UUID ownerId;

    @Column(nullable = false, columnDefinition = "VARCHAR(50)")
    @Enumerated(EnumType.STRING)
    public ArtifactStatus status;

    @Column(columnDefinition = "TEXT")
    public String tags;

    @Column(length = 255)
    public String area;

    @Column(name = "created_at", nullable = false, columnDefinition = "TIMESTAMP")
    public LocalDateTime createdAt;

    @Column(name = "updated_at", columnDefinition = "TIMESTAMP")
    public LocalDateTime updatedAt;

    @Column(nullable = false)
    public boolean deleted;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (updatedAt == null) {
            updatedAt = LocalDateTime.now();
        }
        if (status == null) {
            status = ArtifactStatus.DRAFT;
        }
        deleted = false;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
