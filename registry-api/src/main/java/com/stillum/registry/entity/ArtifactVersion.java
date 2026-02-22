package com.stillum.registry.entity;

import com.stillum.registry.entity.enums.VersionState;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "artifact_versions")
public class ArtifactVersion extends PanacheEntityBase {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "UUID")
    public UUID id;

    @Column(name = "artifact_id", nullable = false, columnDefinition = "UUID")
    public UUID artifactId;

    @Column(nullable = false, length = 50)
    public String version;

    @Column(nullable = false, columnDefinition = "VARCHAR(50)")
    @Enumerated(EnumType.STRING)
    public VersionState state;

    @Column(name = "payload_ref", length = 500)
    public String payloadRef;

    @Column(name = "created_by", columnDefinition = "UUID")
    public UUID createdBy;

    @Column(name = "created_at", nullable = false, columnDefinition = "TIMESTAMP")
    public LocalDateTime createdAt;

    @Column(columnDefinition = "TEXT")
    public String metadata;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (state == null) {
            state = VersionState.DRAFT;
        }
    }
}
