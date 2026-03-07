package com.stillum.publisher.storage;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.util.List;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.HeadObjectRequest;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Request;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Response;
import software.amazon.awssdk.services.s3.model.NoSuchKeyException;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;
import software.amazon.awssdk.services.s3.model.S3Object;

@ApplicationScoped
public class S3StorageClient {

    @Inject
    S3Client s3Client;

    @ConfigProperty(name = "stillum.storage.artifacts-bucket")
    String artifactsBucket;

    @ConfigProperty(name = "stillum.storage.bundles-bucket")
    String bundlesBucket;

    public byte[] downloadBytes(String bucket, String key) {
        ResponseInputStream<?> in = s3Client.getObject(GetObjectRequest.builder().bucket(bucket).key(key).build());
        try (in) {
            return in.readAllBytes();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
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

    /** List all object keys under the given prefix. */
    public List<String> listKeys(String bucket, String prefix) {
        ListObjectsV2Request req = ListObjectsV2Request.builder()
                .bucket(bucket).prefix(prefix).build();
        ListObjectsV2Response resp = s3Client.listObjectsV2(req);
        return resp.contents().stream()
                .map(S3Object::key).toList();
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
