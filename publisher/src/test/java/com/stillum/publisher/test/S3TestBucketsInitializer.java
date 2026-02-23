package com.stillum.publisher.test;

import io.quarkus.arc.profile.IfBuildProfile;
import io.quarkus.runtime.StartupEvent;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import jakarta.inject.Inject;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.CreateBucketRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;

@IfBuildProfile("test")
@ApplicationScoped
public class S3TestBucketsInitializer {

    @Inject
    S3Client s3;

    @ConfigProperty(name = "stillum.storage.artifacts-bucket")
    String artifactsBucket;

    @ConfigProperty(name = "stillum.storage.bundles-bucket")
    String bundlesBucket;

    void onStartup(@Observes StartupEvent event) {
        ensureBucket(artifactsBucket);
        ensureBucket(bundlesBucket);
    }

    private void ensureBucket(String bucket) {
        try {
            s3.createBucket(CreateBucketRequest.builder().bucket(bucket).build());
        } catch (S3Exception e) {
            if (e.statusCode() == 409) {
                return;
            }
            throw e;
        }
    }
}

