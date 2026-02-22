package com.stillum.publisher.service;

import jakarta.enterprise.context.ApplicationScoped;
import java.util.*;

@ApplicationScoped
public class DependencyResolver {

    public List<String> resolve(String versionId) {
        // In a real implementation, this would query a database
        // For now, return empty list (dependencies would be loaded separately)
        return new ArrayList<>();
    }

    public boolean detectCycles(String versionId) {
        return detectCyclesImpl(versionId, new HashSet<>(), new HashSet<>());
    }

    private boolean detectCyclesImpl(String versionId, Set<String> visited, Set<String> recursionStack) {
        if (recursionStack.contains(versionId)) {
            return true; // Cycle detected
        }

        if (visited.contains(versionId)) {
            return false; // Already processed
        }

        visited.add(versionId);
        recursionStack.add(versionId);

        // Get dependencies for this version
        List<String> dependencies = resolve(versionId);

        for (String dependency : dependencies) {
            if (detectCyclesImpl(dependency, visited, recursionStack)) {
                return true; // Cycle detected
            }
        }

        recursionStack.remove(versionId);
        return false; // No cycle
    }

    public List<String> getOrderedDependencies(String versionId) throws Exception {
        if (detectCycles(versionId)) {
            throw new Exception("Circular dependency detected for version: " + versionId);
        }

        List<String> ordered = new ArrayList<>();
        Set<String> visited = new HashSet<>();
        topologicalSort(versionId, visited, ordered);
        return ordered;
    }

    private void topologicalSort(String versionId, Set<String> visited, List<String> result) {
        if (visited.contains(versionId)) {
            return;
        }

        visited.add(versionId);

        List<String> dependencies = resolve(versionId);
        for (String dep : dependencies) {
            topologicalSort(dep, visited, result);
        }

        result.add(versionId);
    }
}
