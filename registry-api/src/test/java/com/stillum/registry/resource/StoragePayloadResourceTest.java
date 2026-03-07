package com.stillum.registry.resource;

import com.stillum.registry.storage.S3StorageClient;
import com.stillum.registry.storage.StoragePathBuilder;
import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import jakarta.inject.Inject;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;

@QuarkusTest
class StoragePayloadResourceTest {

    static final String TENANT_ID = "00000000-0000-0000-0000-000000000001";
    static final String ARTIFACTS_BASE = "/api/tenants/" + TENANT_ID + "/artifacts";
    static final String STORAGE_BASE = "/api/tenants/" + TENANT_ID + "/storage";

    @Inject
    S3StorageClient s3;

    @Test
    void uploadUrl_returnsKeyWithConventionBasedPath() {
        String artifactId = given()
            .contentType(ContentType.JSON)
            .body("{\"type\":\"PROCESS\",\"title\":\"P\"}")
            .when()
            .post(ARTIFACTS_BASE)
            .then()
            .statusCode(201)
            .extract().path("id");

        String versionId = given()
            .contentType(ContentType.JSON)
            .body("{\"version\":\"1.0.0\"}")
            .when()
            .post(ARTIFACTS_BASE + "/" + artifactId + "/versions")
            .then()
            .statusCode(201)
            .extract().path("id");

        // Convention path: tenant-{tid}/process/{aid}/{vid}/process.bpmn
        given()
            .queryParam("artifactId", artifactId)
            .queryParam("versionId", versionId)
            .queryParam("contentType", "application/xml")
            .when()
            .get(STORAGE_BASE + "/upload-url")
            .then()
            .statusCode(200)
            .body("url", notNullValue())
            .body("key", containsString("tenant-" + TENANT_ID + "/process/" + artifactId + "/" + versionId + "/process.bpmn"))
            .body("expiresInSeconds", is(300));
    }

    @Test
    void downloadUrl_withoutUploadedFile_returns400() {
        String artifactId = given()
            .contentType(ContentType.JSON)
            .body("{\"type\":\"FORM\",\"title\":\"F\"}")
            .when()
            .post(ARTIFACTS_BASE)
            .then()
            .statusCode(201)
            .extract().path("id");

        String versionId = given()
            .contentType(ContentType.JSON)
            .body("{\"version\":\"1.0.0\"}")
            .when()
            .post(ARTIFACTS_BASE + "/" + artifactId + "/versions")
            .then()
            .statusCode(201)
            .extract().path("id");

        given()
            .queryParam("artifactId", artifactId)
            .queryParam("versionId", versionId)
            .when()
            .get(STORAGE_BASE + "/download-url")
            .then()
            .statusCode(400)
            .body("error", containsString("has no source reference"));
    }

    @Test
    void downloadUrl_afterFileUploaded_returnsPresignedUrl() {
        String artifactId = given()
            .contentType(ContentType.JSON)
            .body("{\"type\":\"PROCESS\",\"title\":\"P\"}")
            .when()
            .post(ARTIFACTS_BASE)
            .then()
            .statusCode(201)
            .extract().path("id");

        String versionId = given()
            .contentType(ContentType.JSON)
            .body("{\"version\":\"1.0.0\"}")
            .when()
            .post(ARTIFACTS_BASE + "/" + artifactId + "/versions")
            .then()
            .statusCode(201)
            .extract().path("id");

        // Simulate file upload by placing the file at the convention-based path
        UUID tid = UUID.fromString(TENANT_ID);
        UUID aid = UUID.fromString(artifactId);
        UUID vid = UUID.fromString(versionId);
        String key = StoragePathBuilder.fileKey(tid, "PROCESS", aid, vid,
                StoragePathBuilder.defaultFileName("PROCESS"));
        s3.uploadBytes(s3.getArtifactsBucket(), key,
                "<definitions/>".getBytes(), "application/xml");

        given()
            .queryParam("artifactId", artifactId)
            .queryParam("versionId", versionId)
            .when()
            .get(STORAGE_BASE + "/download-url")
            .then()
            .statusCode(200)
            .body("url", notNullValue())
            .body("key", equalTo(key))
            .body("expiresInSeconds", is(300));
    }

    @Test
    void uploadUrl_missingQueryParams_returns400() {
        given()
            .queryParam("versionId", "00000000-0000-0000-0000-000000000300")
            .when()
            .get(STORAGE_BASE + "/upload-url")
            .then()
            .statusCode(400)
            .body("error", containsString("artifactId is required"));
    }
}
