package com.stillum.publisher.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.UUID;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Table(name = "dependency")
public class Dependency extends PanacheEntityBase {

    @Id
    @GeneratedValue
    @UuidGenerator
    @Column(columnDefinition = "uuid", updatable = false)
    public UUID id;

    @Column(name = "artifact_version_id", nullable = false)
    public UUID artifactVersionId;

    @Column(name = "depends_on_artifact_id", nullable = false)
    public UUID dependsOnArtifactId;

    @Column(name = "depends_on_version_id", nullable = false)
    public UUID dependsOnVersionId;
}

