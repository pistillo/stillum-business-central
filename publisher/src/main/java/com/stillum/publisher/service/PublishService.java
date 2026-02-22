package com.stillum.publisher.service;

import com.stillum.publisher.dto.PublishRequest;
import com.stillum.publisher.dto.PublishResponse;
import com.stillum.publisher.dto.ValidationResult;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import java.time.LocalDateTime;
import java.util.UUID;

@ApplicationScoped
public class PublishService {

    @Inject
    ValidationService validationService;

    @Inject
    BundleService bundleService;

    @Inject
    DependencyResolver dependencyResolver;

    @Inject
    StorageClient storageClient;

    @ConfigProperty(name = "stillum.artifacts.types")
    String artifactTypes;

    public PublishResponse publish(PublishRequest request, String tenantId, byte[] payload) throws Exception {
        PublishResponse response = new PublishResponse();
        response.setPublicationId(UUID.randomUUID().toString());

        // Validate payload based on artifact type
        ValidationResult validationResult = validatePayload(request, payload);
        if (!validationResult.isValid()) {
            response.setStatus("VALIDATION_FAILED");
            response.setMessage("Artifact validation failed");
            return response;
        }

        // Resolve dependencies
        try {
            dependencyResolver.getOrderedDependencies(request.getVersionId());
        } catch (Exception e) {
            response.setStatus("DEPENDENCY_RESOLUTION_FAILED");
            response.setMessage("Failed to resolve dependencies: " + e.getMessage());
            return response;
        }

        // Create bundle
        try {
            byte[] bundleData = bundleService.createBundle(
                    request.getArtifactId(),
                    request.getVersionId(),
                    getArtifactType(request.getArtifactId()),
                    payload,
                    null
            );

            // Upload to storage
            String bundleRef = String.format("%s/%s/%s/%s",
                    tenantId,
                    getArtifactType(request.getArtifactId()),
                    request.getArtifactId(),
                    request.getVersionId());

            storageClient.uploadBundle(
                    tenantId,
                    getArtifactType(request.getArtifactId()),
                    request.getArtifactId(),
                    request.getVersionId(),
                    bundleData
            );

            response.setBundleRef(bundleRef);
            response.setPublishedAt(LocalDateTime.now());
            response.setStatus("PUBLISHED");
            response.setMessage("Artifact published successfully");

        } catch (Exception e) {
            response.setStatus("PUBLICATION_FAILED");
            response.setMessage("Failed to publish artifact: " + e.getMessage());
        }

        return response;
    }

    private ValidationResult validatePayload(PublishRequest request, byte[] payload) {
        String type = getArtifactType(request.getArtifactId());
        String payloadStr = new String(payload);

        switch (type) {
            case "bpmn":
                return validationService.validateBpmn(payloadStr);
            case "dmn":
                return validationService.validateDmn(payloadStr);
            case "form":
                return validationService.validateForm(payloadStr);
            case "request":
                return validationService.validateRequest(payloadStr);
            default:
                return new ValidationResult(true);
        }
    }

    private String getArtifactType(String artifactId) {
        // Parse artifact type from ID (format: type-name-version)
        String[] parts = artifactId.split("-");
        if (parts.length > 0) {
            return parts[0].toLowerCase();
        }
        return "unknown";
    }
}
