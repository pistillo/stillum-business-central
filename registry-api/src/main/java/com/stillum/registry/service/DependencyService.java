package com.stillum.registry.service;

import com.stillum.registry.dto.request.AddDependencyRequest;
import com.stillum.registry.dto.response.DependencyResponse;
import com.stillum.registry.entity.Dependency;
import com.stillum.registry.exception.ArtifactNotFoundException;
import com.stillum.registry.exception.DependencyCycleException;
import com.stillum.registry.filter.EnforceTenantRls;
import com.stillum.registry.repository.ArtifactRepository;
import com.stillum.registry.repository.ArtifactVersionRepository;
import com.stillum.registry.repository.DependencyRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@ApplicationScoped
@EnforceTenantRls
public class DependencyService {

    @Inject
    DependencyRepository depRepo;

    @Inject
    ArtifactVersionRepository versionRepo;

    @Inject
    ArtifactRepository artifactRepo;

    @Transactional
    public List<DependencyResponse> list(UUID tenantId, UUID artifactId, UUID versionId) {
        artifactRepo.findByIdAndTenant(artifactId, tenantId)
                .orElseThrow(() -> new ArtifactNotFoundException(artifactId));
        versionRepo.findByIdAndArtifact(versionId, artifactId)
                .orElseThrow(() -> new ArtifactNotFoundException(artifactId, versionId));

        return depRepo.findByVersion(versionId)
                .stream()
                .map(DependencyResponse::from)
                .toList();
    }

    @Transactional
    public DependencyResponse add(
            UUID tenantId, UUID artifactId, UUID versionId, AddDependencyRequest req) {
        artifactRepo.findByIdAndTenant(artifactId, tenantId)
                .orElseThrow(() -> new ArtifactNotFoundException(artifactId));
        versionRepo.findByIdAndArtifact(versionId, artifactId)
                .orElseThrow(() -> new ArtifactNotFoundException(artifactId, versionId));

        // Verifica che la versione di destinazione esista
        versionRepo.findByIdOptional(req.dependsOnVersionId())
                .orElseThrow(() -> new ArtifactNotFoundException(
                    req.dependsOnArtifactId(), req.dependsOnVersionId()));

        // Verifica duplicato
        if (depRepo.findByVersionAndDependsOn(versionId, req.dependsOnVersionId()).isPresent()) {
            throw new IllegalArgumentException("Dependency already exists");
        }

        // Rilevamento cicli tramite DFS
        detectCycle(versionId, req.dependsOnVersionId());

        Dependency dep = new Dependency();
        dep.artifactVersionId = versionId;
        dep.dependsOnArtifactId = req.dependsOnArtifactId();
        dep.dependsOnVersionId = req.dependsOnVersionId();
        depRepo.persist(dep);
        return DependencyResponse.from(dep);
    }

    @Transactional
    public void remove(UUID tenantId, UUID artifactId, UUID versionId, UUID dependencyId) {
        artifactRepo.findByIdAndTenant(artifactId, tenantId)
                .orElseThrow(() -> new ArtifactNotFoundException(artifactId));
        Dependency dep = depRepo.findByIdOptional(dependencyId)
                .orElseThrow(() -> new IllegalArgumentException("Dependency not found: " + dependencyId));
        if (!dep.artifactVersionId.equals(versionId)) {
            throw new ArtifactNotFoundException(artifactId, versionId);
        }
        depRepo.delete(dep);
    }

    /**
     * DFS con colorazione: verifica che aggiungere un arco da versionId → newDepVersionId
     * non introduca un ciclo.
     */
    private void detectCycle(UUID versionId, UUID newDepVersionId) {
        // Carica il grafo completo delle dipendenze esistenti + la nuova
        Map<UUID, List<UUID>> graph = buildGraph();
        graph.computeIfAbsent(versionId, k -> new ArrayList<>()).add(newDepVersionId);

        Set<UUID> visited = new HashSet<>();
        Set<UUID> inStack = new HashSet<>();

        for (UUID node : graph.keySet()) {
            if (!visited.contains(node)) {
                dfs(node, graph, visited, inStack, versionId);
            }
        }
    }

    private void dfs(
            UUID node,
            Map<UUID, List<UUID>> graph,
            Set<UUID> visited,
            Set<UUID> inStack,
            UUID originVersion) {
        inStack.add(node);
        List<UUID> neighbors = graph.getOrDefault(node, List.of());
        for (UUID neighbor : neighbors) {
            if (inStack.contains(neighbor)) {
                throw new DependencyCycleException(originVersion);
            }
            if (!visited.contains(neighbor)) {
                dfs(neighbor, graph, visited, inStack, originVersion);
            }
        }
        inStack.remove(node);
        visited.add(node);
    }

    private Map<UUID, List<UUID>> buildGraph() {
        Map<UUID, List<UUID>> graph = new HashMap<>();
        List<Dependency> allDeps = depRepo.listAll();
        for (Dependency d : allDeps) {
            graph.computeIfAbsent(d.artifactVersionId, k -> new ArrayList<>())
                 .add(d.dependsOnVersionId);
        }
        return graph;
    }
}
