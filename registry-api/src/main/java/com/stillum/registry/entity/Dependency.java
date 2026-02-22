package com.stillum.registry.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "dependencies")
public class Dependency extends PanacheEntityBase {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "UUID")
    public UUID id;

    @Column(name = "artifact_version_id", nullable = false, columnDefinition = "UUID")
    public UUID artifactVersionId;

    @Column(name = "depends_on_artifact_id", nullable = false, columnDefinition = "UUID")
    public UUID dependsOnArtifactId;

    @Column(name = "depends_on_version_id", columnDefinition = "UUID")
    public UUID dependsOnVersionId;
}
