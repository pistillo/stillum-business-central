package com.stillum.registry.entity;

import com.stillum.registry.entity.enums.VersionState;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;
import java.util.UUID;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UuidGenerator;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "artifact_version")
@DynamicUpdate
public class ArtifactVersion extends PanacheEntityBase {

    @Id
    @GeneratedValue
    @UuidGenerator
    @Column(columnDefinition = "uuid", updatable = false)
    public UUID id;

    @Column(name = "artifact_id", nullable = false)
    public UUID artifactId;

    @Column(nullable = false)
    public String version;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    public VersionState state;

    @Column(name = "payload_ref")
    public String payloadRef;

    @Column(name = "created_by")
    public UUID createdBy;

    @Column(name = "created_at", updatable = false)
    public OffsetDateTime createdAt;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    public String metadata;

    @Column(name = "source_code")
    public String sourceCode;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "npm_dependencies", columnDefinition = "jsonb")
    public String npmDependencies;

    @Column(name = "npm_package_ref")
    public String npmPackageRef;

    @PrePersist
    void prePersist() {
        createdAt = OffsetDateTime.now();
        if (state == null) {
            state = VersionState.DRAFT;
        }
    }
}
