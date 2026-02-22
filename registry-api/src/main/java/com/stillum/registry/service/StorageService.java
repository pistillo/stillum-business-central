package com.stillum.registry.service;

import jakarta.enterprise.context.ApplicationScoped;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;
import java.time.Duration;
import java.util.UUID;

@ApplicationScoped
public class StorageService {

    private final S3Client s3Client;
    private final S3Presigner presigner;
    private final String bucketName;

    public StorageService(S3Client s3Client, S3Presigner presigner) {
        this.s3Client = s3Client;
        this.presigner = presigner;
        this.bucketName = "stillum-registry";
    }

    public String uploadPayload(UUID tenantId, UUID artifactId, String version, byte[] content) {
        String key = String.format("%s/%s/%s/payload", tenantId, artifactId, version);
        
        s3Client.putObject(
            PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build(),
            software.amazon.awssdk.core.sync.RequestBody.fromBytes(content)
        );
        
        return key;
    }

    public String getPresignedUrl(String objectKey) {
        GetObjectRequest getRequest = GetObjectRequest.builder()
            .bucket(bucketName)
            .key(objectKey)
            .build();

        GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
            .signatureDuration(Duration.ofMinutes(15))
            .getObjectRequest(getRequest)
            .build();

        PresignedGetObjectRequest presignedRequest = presigner.presignGetObject(presignRequest);
        return presignedRequest.url().toString();
    }
}
