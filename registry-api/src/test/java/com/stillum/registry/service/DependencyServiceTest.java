package com.stillum.registry.service;

import com.stillum.registry.entity.Dependency;
import com.stillum.registry.exception.DependencyCycleException;
import com.stillum.registry.repository.ArtifactRepository;
import com.stillum.registry.repository.ArtifactVersionRepository;
import com.stillum.registry.repository.DependencyRepository;
import com.stillum.registry.dto.request.AddDependencyRequest;
import com.stillum.registry.entity.Artifact;
import com.stillum.registry.entity.ArtifactVersion;
import com.stillum.registry.entity.enums.VersionState;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DependencyServiceTest {

    @Mock
    DependencyRepository depRepo;

    @Mock
    ArtifactVersionRepository versionRepo;

    @Mock
    ArtifactRepository artifactRepo;

    @InjectMocks
    DependencyService service;

    private final UUID tenantId = UUID.randomUUID();
    private final UUID artifactId = UUID.randomUUID();
    private final UUID versionA = UUID.randomUUID();
    private final UUID versionB = UUID.randomUUID();
    private final UUID versionC = UUID.randomUUID();

    @BeforeEach
    void setup() {

        Artifact artifact = new Artifact();
        artifact.id = artifactId;
        artifact.tenantId = tenantId;
        when(artifactRepo.findByIdAndTenant(artifactId, tenantId))
                .thenReturn(Optional.of(artifact));

        ArtifactVersion av = new ArtifactVersion();
        av.id = versionA;
        av.artifactId = artifactId;
        av.state = VersionState.DRAFT;
        when(versionRepo.findByIdAndArtifact(versionA, artifactId))
                .thenReturn(Optional.of(av));

        ArtifactVersion avB = new ArtifactVersion();
        avB.id = versionB;
        avB.artifactId = artifactId;
        avB.state = VersionState.DRAFT;
        when(versionRepo.findByIdOptional(versionB)).thenReturn(Optional.of(avB));
        when(versionRepo.findByIdOptional(versionC)).thenReturn(Optional.of(avB));

        when(depRepo.findByVersionAndDependsOn(any(), any())).thenReturn(Optional.empty());
        doNothing().when(depRepo).persist(any(Dependency.class));
    }

    @Test
    void addDependency_noCycle_succeeds() {
        // A→B: no cycle
        when(depRepo.listAll()).thenReturn(List.of());

        AddDependencyRequest req = new AddDependencyRequest(artifactId, versionB);
        var result = service.add(tenantId, artifactId, versionA, req);
        assertNotNull(result);
    }

    @Test
    void addDependency_directCycle_throws() {
        // Setup: B→A already exists (via listAll)
        Dependency existing = new Dependency();
        existing.id = UUID.randomUUID();
        existing.artifactVersionId = versionB;
        existing.dependsOnVersionId = versionA;
        when(depRepo.listAll()).thenReturn(List.of(existing));

        // Adding A→B would create cycle A→B→A
        AddDependencyRequest req = new AddDependencyRequest(artifactId, versionB);
        assertThrows(DependencyCycleException.class,
                () -> service.add(tenantId, artifactId, versionA, req));
    }

    @Test
    void addDependency_transitveCycle_throws() {
        // B→C, C→A already exist; adding A→B creates cycle
        Dependency depBC = new Dependency();
        depBC.id = UUID.randomUUID();
        depBC.artifactVersionId = versionB;
        depBC.dependsOnVersionId = versionC;

        Dependency depCA = new Dependency();
        depCA.id = UUID.randomUUID();
        depCA.artifactVersionId = versionC;
        depCA.dependsOnVersionId = versionA;

        when(depRepo.listAll()).thenReturn(List.of(depBC, depCA));

        AddDependencyRequest req = new AddDependencyRequest(artifactId, versionB);
        assertThrows(DependencyCycleException.class,
                () -> service.add(tenantId, artifactId, versionA, req));
    }
}
