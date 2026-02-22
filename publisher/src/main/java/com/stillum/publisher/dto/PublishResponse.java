package com.stillum.publisher.dto;

import java.time.LocalDateTime;

public class PublishResponse {
    private String publicationId;
    private String bundleRef;
    private LocalDateTime publishedAt;
    private String status;
    private String message;

    public PublishResponse() {
    }

    public PublishResponse(String publicationId, String bundleRef, LocalDateTime publishedAt, String status) {
        this.publicationId = publicationId;
        this.bundleRef = bundleRef;
        this.publishedAt = publishedAt;
        this.status = status;
    }

    public String getPublicationId() {
        return publicationId;
    }

    public void setPublicationId(String publicationId) {
        this.publicationId = publicationId;
    }

    public String getBundleRef() {
        return bundleRef;
    }

    public void setBundleRef(String bundleRef) {
        this.bundleRef = bundleRef;
    }

    public LocalDateTime getPublishedAt() {
        return publishedAt;
    }

    public void setPublishedAt(LocalDateTime publishedAt) {
        this.publishedAt = publishedAt;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
