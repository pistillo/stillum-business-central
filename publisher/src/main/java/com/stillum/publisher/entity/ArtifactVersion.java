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
@Table(name = "artifact_version")
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

    @Column(nullable = false)
    public String state;

    @Column(name = "payload_ref")
    public String payloadRef;

    @Column(name = "created_by")
    public UUID createdBy;

    @Column(name = "created_at", updatable = false)
    public OffsetDateTime createdAt;

    @JdbcTypeCode(SqlTypes.JSON)
    public JsonNode metadata;
}

