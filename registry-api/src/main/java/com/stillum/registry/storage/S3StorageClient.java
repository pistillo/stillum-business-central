package com.stillum.registry.storage;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.net.URI;
import java.time.Duration;
import java.util.List;
import java.util.Optional;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import software.amazon.awssdk.core.ResponseBytes;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3Configuration;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;
import software.amazon.awssdk.services.s3.model.HeadObjectRequest;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Request;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Response;
import software.amazon.awssdk.services.s3.model.NoSuchKeyException;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;
import software.amazon.awssdk.services.s3.model.S3Object;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

@ApplicationScoped
public class S3StorageClient {

    @Inject
    S3Client s3Client;

    @Inject
    S3Presigner presigner;

    @ConfigProperty(name = "quarkus.s3.aws.region")
    String s3Region;

    @ConfigProperty(name = "quarkus.s3.aws.credentials.static-provider.access-key-id")
    Optional<String> s3AccessKeyId;

    @ConfigProperty(name = "quarkus.s3.aws.credentials.static-provider.secret-access-key")
    Optional<String> s3SecretAccessKey;

    @ConfigProperty(name = "stillum.storage.public-s3-endpoint")
    Optional<String> publicS3Endpoint;

    @ConfigProperty(name = "stillum.storage.artifacts-bucket")
    String artifactsBucket;

    @ConfigProperty(name = "stillum.storage.bundles-bucket")
    String bundlesBucket;

    @ConfigProperty(name = "stillum.storage.presigned-url-expiry-seconds")
    long expirySeconds;

    public String generateUploadPresignedUrl(String bucket, String key, String contentType) {
        S3Presigner activePresigner = getPresigner();
        PutObjectPresignRequest req = PutObjectPresignRequest.builder()
                .signatureDuration(Duration.ofSeconds(expirySeconds))
                .putObjectRequest(r -> r.bucket(bucket).key(key).contentType(contentType))
                .build();
        return activePresigner.presignPutObject(req).url().toString();
    }

    public String generateDownloadPresignedUrl(String bucket, String key) {
        S3Presigner activePresigner = getPresigner();
        GetObjectPresignRequest req = GetObjectPresignRequest.builder()
                .signatureDuration(Duration.ofSeconds(expirySeconds))
                .getObjectRequest(r -> r.bucket(bucket).key(key))
                .build();
        return activePresigner.presignGetObject(req).url().toString();
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

    public byte[] downloadBytes(String bucket, String key) {
        ResponseBytes<GetObjectResponse> response = s3Client.getObjectAsBytes(
                GetObjectRequest.builder()
                        .bucket(bucket)
                        .key(key)
                        .build());
        return response.asByteArray();
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

    private S3Presigner getPresigner() {
        if (publicS3Endpoint.isEmpty() || publicS3Endpoint.get().isBlank()) {
            return presigner;
        }
        S3Presigner.Builder builder = S3Presigner.builder()
                .region(Region.of(s3Region))
                .serviceConfiguration(S3Configuration.builder().pathStyleAccessEnabled(true).build())
                .endpointOverride(URI.create(publicS3Endpoint.get()));
        if (s3AccessKeyId.isPresent() && s3SecretAccessKey.isPresent()) {
            builder.credentialsProvider(StaticCredentialsProvider.create(
                    AwsBasicCredentials.create(s3AccessKeyId.get(), s3SecretAccessKey.get())));
        } else {
            builder.credentialsProvider(DefaultCredentialsProvider.create());
        }
        return builder.build();
    }
}
