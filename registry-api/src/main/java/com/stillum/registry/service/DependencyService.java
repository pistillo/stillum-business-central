package com.stillum.registry.service;

import com.stillum.registry.dto.CreateDependencyRequest;
import com.stillum.registry.dto.DependencyResponse;
import com.stillum.registry.entity.Dependency;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import java.util.*;

@ApplicationScoped
public class DependencyService {

    @Transactional
    public Dependency addDependency(UUID versionId, CreateDependencyRequest request) {
        if (hasCyclicDependency(versionId, request.dependsOnArtifactId)) {
            return null;
        }
        
        Dependency dependency = new Dependency();
        dependency.artifactVersionId = versionId;
        dependency.dependsOnArtifactId = request.dependsOnArtifactId;
        dependency.dependsOnVersionId = request.dependsOnVersionId;
        dependency.persist();
        return dependency;
    }

    public List<Dependency> getDependencies(UUID versionId) {
        return Dependency.find("artifactVersionId", versionId).list();
    }

    private boolean hasCyclicDependency(UUID versionId, UUID dependsOnArtifactId) {
        Set<UUID> visited = new HashSet<>();
        return isCyclic(versionId, dependsOnArtifactId, visited);
    }

    private boolean isCyclic(UUID currentVersionId, UUID targetArtifactId, Set<UUID> visited) {
        visited.add(currentVersionId);
        
        List<Dependency> dependencies = Dependency.find("artifactVersionId", currentVersionId).list();
        for (Dependency dep : dependencies) {
            if (dep.dependsOnArtifactId.equals(targetArtifactId)) {
                return true;
            }
            if (!visited.contains(dep.dependsOnVersionId) && dep.dependsOnVersionId != null) {
                if (isCyclic(dep.dependsOnVersionId, targetArtifactId, visited)) {
                    return true;
                }
            }
        }
        return false;
    }

    public DependencyResponse toDependencyResponse(Dependency dependency) {
        DependencyResponse response = new DependencyResponse();
        response.id = dependency.id;
        response.artifactVersionId = dependency.artifactVersionId;
        response.dependsOnArtifactId = dependency.dependsOnArtifactId;
        response.dependsOnVersionId = dependency.dependsOnVersionId;
        return response;
    }
}
