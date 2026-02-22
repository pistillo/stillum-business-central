package com.stillum.publisher.service;

import io.quarkus.amazon.s3.runtime.S3Client;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;
import software.amazon.awssdk.core.sync.RequestBody;
import java.time.Duration;

@ApplicationScoped
public class StorageClient {

    @Inject
    S3Client s3Client;

    @ConfigProperty(name = "stillum.storage.bucket", defaultValue = "stillum-bundles")
    String bucket;

    public void uploadBundle(String tenantId, String type, String artifactId, String versionId, byte[] data) {
        String key = String.format("%s/%s/%s/%s", tenantId, type, artifactId, versionId);
        
        PutObjectRequest request = PutObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .metadata(java.util.Map.of(
                        "artifact-id", artifactId,
                        "version-id", versionId,
                        "type", type
                ))
                .build();

        s3Client.putObject(request, RequestBody.fromBytes(data));
    }

    public byte[] downloadBundle(String bundleRef) {
        GetObjectRequest request = GetObjectRequest.builder()
                .bucket(bucket)
                .key(bundleRef)
                .build();

        return s3Client.getObject(request).readAllBytes();
    }

    public String generatePresignedUploadUrl(String path) {
        try (S3Presigner presigner = S3Presigner.builder().build()) {
            PutObjectRequest objectRequest = PutObjectRequest.builder()
                    .bucket(bucket)
                    .key(path)
                    .build();

            PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
                    .signatureDuration(Duration.ofMinutes(15))
                    .putObjectRequest(objectRequest)
                    .build();

            PresignedPutObjectRequest presignedRequest = presigner.presignPutObject(presignRequest);
            return presignedRequest.url().toString();
        }
    }

    public String generatePresignedDownloadUrl(String path) {
        try (S3Presigner presigner = S3Presigner.builder().build()) {
            GetObjectRequest objectRequest = GetObjectRequest.builder()
                    .bucket(bucket)
                    .key(path)
                    .build();

            GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                    .signatureDuration(Duration.ofMinutes(15))
                    .getObjectRequest(objectRequest)
                    .build();

            PresignedGetObjectRequest presignedRequest = presigner.presignGetObject(presignRequest);
            return presignedRequest.url().toString();
        }
    }
}
