package com.stillum.publisher.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class PublishRequest {
    @NotBlank(message = "Artifact ID is required")
    private String artifactId;

    @NotBlank(message = "Version ID is required")
    private String versionId;

    @NotBlank(message = "Environment ID is required")
    private String environmentId;

    private String notes;

    private String releaseNotes;

    private String payload;

    public PublishRequest() {
    }

    public PublishRequest(String artifactId, String versionId, String environmentId) {
        this.artifactId = artifactId;
        this.versionId = versionId;
        this.environmentId = environmentId;
    }

    public String getArtifactId() {
        return artifactId;
    }

    public void setArtifactId(String artifactId) {
        this.artifactId = artifactId;
    }

    public String getVersionId() {
        return versionId;
    }

    public void setVersionId(String versionId) {
        this.versionId = versionId;
    }

    public String getEnvironmentId() {
        return environmentId;
    }

    public void setEnvironmentId(String environmentId) {
        this.environmentId = environmentId;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getReleaseNotes() {
        return releaseNotes;
    }

    public void setReleaseNotes(String releaseNotes) {
        this.releaseNotes = releaseNotes;
    }

    public String getPayload() {
        return payload;
    }

    public void setPayload(String payload) {
        this.payload = payload;
    }
}
