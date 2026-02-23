package com.stillum.registry.resource;

import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;

@QuarkusTest
class ArtifactVersionResourceTest {

    static final String TENANT_ID = "00000000-0000-0000-0000-000000000001";
    static final String ARTIFACTS_PATH = "/api/tenants/" + TENANT_ID + "/artifacts";

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
    void createVersion_validRequest_returns201() {
        String artifactId = createArtifact("PROCESS", "Artifact for Version Test");

        given()
            .contentType(ContentType.JSON)
            .body("{\"version\":\"1.0.0\",\"payloadRef\":\"tenant-x/artifacts/process/a/v.xml\"}")
            .when()
            .post(ARTIFACTS_PATH + "/" + artifactId + "/versions")
            .then()
            .statusCode(201)
            .body("id", notNullValue())
            .body("version", is("1.0.0"))
            .body("state", is("DRAFT"));
    }

    @Test
    void createVersion_duplicate_returns400() {
        String artifactId = createArtifact("RULE", "Artifact Dup Version");
        createVersion(artifactId, "1.0.0");

        given()
            .contentType(ContentType.JSON)
            .body("{\"version\":\"1.0.0\"}")
            .when()
            .post(ARTIFACTS_PATH + "/" + artifactId + "/versions")
            .then()
            .statusCode(400);
    }

    @Test
    void listVersions_returns200() {
        String artifactId = createArtifact("FORM", "Artifact List Versions");
        createVersion(artifactId, "1.0.0");
        createVersion(artifactId, "1.0.1");

        given()
            .when()
            .get(ARTIFACTS_PATH + "/" + artifactId + "/versions")
            .then()
            .statusCode(200);
    }

    @Test
    void deleteVersion_draft_returns204() {
        String artifactId = createArtifact("REQUEST", "Artifact Delete Version");
        String versionId = createVersion(artifactId, "1.0.0");

        given()
            .when()
            .delete(ARTIFACTS_PATH + "/" + artifactId + "/versions/" + versionId)
            .then()
            .statusCode(204);
    }

    @Test
    void updatePayloadRef_draftVersion_returns200() {
        String artifactId = createArtifact("PROCESS", "Artifact Update PayloadRef");
        String versionId = createVersion(artifactId, "1.0.0");

        given()
            .contentType(ContentType.JSON)
            .body("{\"payloadRef\":\"tenant-x/artifacts/process/a/v2.xml\"}")
            .when()
            .put(ARTIFACTS_PATH + "/" + artifactId + "/versions/" + versionId + "/payload-ref")
            .then()
            .statusCode(200)
            .body("payloadRef", is("tenant-x/artifacts/process/a/v2.xml"));
    }
}
