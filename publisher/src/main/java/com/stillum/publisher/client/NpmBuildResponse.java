package com.stillum.publisher.client;

public record NpmBuildResponse(
        boolean success,
        String npmPackageRef,
        String packageName,
        String packageVersion,
        Long buildDurationMs,
        Long bundleSizeBytes,
        String error,
        String phase,
        String details) {
}
