package com.stillum.publisher.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;
import java.util.UUID;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Table(name = "publication")
public class Publication extends PanacheEntityBase {

    @Id
    @GeneratedValue
    @UuidGenerator
    @Column(columnDefinition = "uuid", updatable = false)
    public UUID id;

    @Column(name = "artifact_version_id", nullable = false)
    public UUID artifactVersionId;

    @Column(name = "environment_id", nullable = false)
    public UUID environmentId;

    @Column(name = "published_by")
    public UUID publishedBy;

    @Column(name = "published_at", updatable = false)
    public OffsetDateTime publishedAt;

    public String notes;

    @Column(name = "bundle_ref")
    public String bundleRef;
}

