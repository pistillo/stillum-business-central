package com.stillum.publisher.client;

public enum NpmArtifactType {
    MODULE,
    COMPONENT;

    public static NpmArtifactType from(String artifactType) {
        String message = "Artifact type must be MODULE or COMPONENT for npm build: " + artifactType;
        if (artifactType == null || artifactType.isBlank()) {
            throw new IllegalArgumentException(message);
        }
        try {
            return NpmArtifactType.valueOf(artifactType.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException(message, e);
        }
    }
}
