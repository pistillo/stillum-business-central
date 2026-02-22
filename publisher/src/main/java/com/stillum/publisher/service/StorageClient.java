package com.stillum.publisher.service;

import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;
import software.amazon.awssdk.regions.Region;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import java.io.IOException;
import java.net.URI;
import java.time.Duration;

@ApplicationScoped
public class StorageClient {

    @Inject
    S3Client s3Client;

    @ConfigProperty(name = "stillum.storage.bucket", defaultValue = "stillum-bundles")
    String bucket;

    @ConfigProperty(name = "quarkus.s3.endpoint-override", defaultValue = "http://localhost:9000")
    String s3Endpoint;

    @ConfigProperty(name = "quarkus.s3.aws.region", defaultValue = "us-east-1")
    String s3Region;

    public void uploadBundle(String tenantId, String type, String artifactId, String versionId, byte[] data) {
        String key = String.format("%s/%s/%s/%s.zip", tenantId, type, artifactId, versionId);

        PutObjectRequest request = PutObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .contentType("application/zip")
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

        try (ResponseInputStream<GetObjectResponse> response = s3Client.getObject(request)) {
            return response.readAllBytes();
        } catch (IOException e) {
            throw new RuntimeException("Failed to download bundle: " + bundleRef, e);
        }
    }

    public String generatePresignedUploadUrl(String path) {
        try (S3Presigner presigner = S3Presigner.builder()
                .endpointOverride(URI.create(s3Endpoint))
                .region(Region.of(s3Region))
                .build()) {

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
        try (S3Presigner presigner = S3Presigner.builder()
                .endpointOverride(URI.create(s3Endpoint))
                .region(Region.of(s3Region))
                .build()) {

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
