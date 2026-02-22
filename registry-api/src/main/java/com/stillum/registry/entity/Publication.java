package com.stillum.registry.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "publications")
public class Publication extends PanacheEntityBase {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "UUID")
    public UUID id;

    @Column(name = "artifact_version_id", nullable = false, columnDefinition = "UUID")
    public UUID artifactVersionId;

    @Column(name = "environment_id", nullable = false, columnDefinition = "UUID")
    public UUID environmentId;

    @Column(name = "published_by", columnDefinition = "UUID")
    public UUID publishedBy;

    @Column(name = "published_at", nullable = false, columnDefinition = "TIMESTAMP")
    public LocalDateTime publishedAt;

    @Column(columnDefinition = "TEXT")
    public String notes;

    @Column(name = "bundle_ref", length = 500)
    public String bundleRef;

    @Column(name = "release_notes", columnDefinition = "TEXT")
    public String releaseNotes;

    @PrePersist
    protected void onCreate() {
        if (publishedAt == null) {
            publishedAt = LocalDateTime.now();
        }
    }
}
