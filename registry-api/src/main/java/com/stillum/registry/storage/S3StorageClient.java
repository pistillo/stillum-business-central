package com.stillum.registry.storage;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.time.Duration;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.HeadObjectRequest;
import software.amazon.awssdk.services.s3.model.NoSuchKeyException;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

@ApplicationScoped
public class S3StorageClient {

    @Inject
    S3Client s3Client;

    @Inject
    S3Presigner presigner;

    @ConfigProperty(name = "stillum.storage.artifacts-bucket")
    String artifactsBucket;

    @ConfigProperty(name = "stillum.storage.bundles-bucket")
    String bundlesBucket;

    @ConfigProperty(name = "stillum.storage.presigned-url-expiry-seconds")
    long expirySeconds;

    public String generateUploadPresignedUrl(String bucket, String key, String contentType) {
        PutObjectPresignRequest req = PutObjectPresignRequest.builder()
                .signatureDuration(Duration.ofSeconds(expirySeconds))
                .putObjectRequest(r -> r.bucket(bucket).key(key).contentType(contentType))
                .build();
        return presigner.presignPutObject(req).url().toString();
    }

    public String generateDownloadPresignedUrl(String bucket, String key) {
        GetObjectPresignRequest req = GetObjectPresignRequest.builder()
                .signatureDuration(Duration.ofSeconds(expirySeconds))
                .getObjectRequest(r -> r.bucket(bucket).key(key))
                .build();
        return presigner.presignGetObject(req).url().toString();
    }

    public void uploadBytes(String bucket, String key, byte[] data, String contentType) {
        s3Client.putObject(
                PutObjectRequest.builder()
                        .bucket(bucket)
                        .key(key)
                        .contentType(contentType)
                        .build(),
                RequestBody.fromBytes(data));
    }

    public boolean exists(String bucket, String key) {
        try {
            s3Client.headObject(HeadObjectRequest.builder().bucket(bucket).key(key).build());
            return true;
        } catch (NoSuchKeyException e) {
            return false;
        } catch (S3Exception e) {
            if (e.statusCode() == 404) {
                return false;
            }
            throw e;
        }
    }

    public String getArtifactsBucket() {
        return artifactsBucket;
    }

    public String getBundlesBucket() {
        return bundlesBucket;
    }
}
