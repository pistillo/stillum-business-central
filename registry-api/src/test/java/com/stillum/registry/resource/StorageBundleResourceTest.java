package com.stillum.registry.resource;

import com.stillum.registry.storage.S3StorageClient;
import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import jakarta.inject.Inject;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;

@QuarkusTest
class StorageBundleResourceTest {

    static final String TENANT_ID = "00000000-0000-0000-0000-000000000001";
    static final String ARTIFACTS_PATH = "/api/tenants/" + TENANT_ID + "/artifacts";
    static final String STORAGE_PATH = "/api/tenants/" + TENANT_ID + "/storage";

    @Inject
    S3StorageClient s3;

    private String createArtifact(String type, String title) {
        return given()
            .contentType(ContentType.JSON)
            .body("{\"type\":\"" + type + "\",\"title\":\"" + title + "\"}")
            .when()
            .post(ARTIFACTS_PATH)
            .then()
            .statusCode(201)
            .extract().path("id");
    }

    private String createVersion(String artifactId, String version) {
        return given()
            .contentType(ContentType.JSON)
            .body("{\"version\":\"" + version + "\"}")
            .when()
            .post(ARTIFACTS_PATH + "/" + artifactId + "/versions")
            .then()
            .statusCode(201)
            .extract().path("id");
    }

    @Test
    void bundleDownloadUrl_missingBundle_returns404() {
        String artifactId = createArtifact("PROCESS", "Artifact Bundle Missing");
        String versionId = createVersion(artifactId, "1.0.0");

        given()
            .when()
            .get(STORAGE_PATH + "/bundle-download-url?artifactId=" + artifactId + "&versionId=" + versionId)
            .then()
            .statusCode(404);
    }

    @Test
    void bundleUploadUrl_noOverwrite_returns409_whenAlreadyExists() {
        String artifactId = createArtifact("PROCESS", "Artifact Bundle Upload");
        String versionId = createVersion(artifactId, "1.0.0");

        String key = given()
            .when()
            .get(STORAGE_PATH + "/bundle-upload-url?artifactId=" + artifactId + "&versionId=" + versionId)
            .then()
            .statusCode(200)
            .body("url", notNullValue())
            .body("key", notNullValue())
            .body("key", containsString("/bundles/"))
            .extract().path("key");

        s3.uploadBytes(s3.getBundlesBucket(), key, "test".getBytes(), "application/zip");

        given()
            .when()
            .get(STORAGE_PATH + "/bundle-upload-url?artifactId=" + artifactId + "&versionId=" + versionId)
            .then()
            .statusCode(409)
            .body("error", containsString("Object already exists"));
    }

    @Test
    void bundleDownloadUrl_existingBundle_returns200() {
        String artifactId = createArtifact("PROCESS", "Artifact Bundle Download");
        String versionId = createVersion(artifactId, "1.0.0");

        String key = given()
            .when()
            .get(STORAGE_PATH + "/bundle-upload-url?artifactId=" + artifactId + "&versionId=" + versionId)
            .then()
            .statusCode(200)
            .extract().path("key");

        s3.uploadBytes(s3.getBundlesBucket(), key, "test".getBytes(), "application/zip");

        given()
            .when()
            .get(STORAGE_PATH + "/bundle-download-url?artifactId=" + artifactId + "&versionId=" + versionId)
            .then()
            .statusCode(200)
            .body("url", notNullValue())
            .body("key", is(key));
    }
}

