package com.stillum.publisher.client;

import java.util.List;
import java.util.Map;

public record NpmBuildRequest(
        String tenantId,
        String artifactId,
        String versionId,
        String artifactTitle,
        String artifactType,
        String version,
        String sourceCode,
        Map<String, String> npmDependencies,
        List<ComponentSource> components) {

    public record ComponentSource(
            String artifactId,
            String title,
            String sourceCode) {
    }
}
