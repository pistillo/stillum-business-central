package com.stillum.publisher.resource;

import com.stillum.publisher.storage.S3StorageClient;
import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import java.util.UUID;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;

@QuarkusTest
class PublishResourceErrorPathsTest {

    static final UUID TENANT_A = UUID.fromString("00000000-0000-0000-0000-000000000001");
    static final UUID TENANT_B = UUID.fromString("00000000-0000-0000-0000-000000000002");
    static final UUID ENV_DEV = UUID.fromString("00000000-0000-0000-0000-000000000020");

    @Inject
    EntityManager em;

    @Inject
    S3StorageClient s3;

    @Test
    void publish_environmentNotFound_returns404_andAuditsFailure() {
        UUID artifactId = UUID.randomUUID();
        UUID versionId = UUID.randomUUID();
        UUID envId = UUID.randomUUID();
        String payloadKey = "tenant-" + TENANT_A + "/artifacts/process/" + artifactId + "/" + versionId + ".xml";
        seedArtifactWithVersion(TENANT_A, "PROCESS", artifactId, versionId, payloadKey, "DRAFT");
        s3.uploadBytes(s3.getArtifactsBucket(), payloadKey, "<definitions/>".getBytes(), "application/xml");

        long auditBefore = countAudit(TENANT_A, "PUBLISH_FAILURE");

        given()
            .contentType(ContentType.JSON)
            .body("{\"artifactId\":\"" + artifactId + "\",\"versionId\":\"" + versionId + "\",\"environmentId\":\"" + envId + "\"}")
            .when()
            .post("/api/tenants/" + TENANT_A + "/publish")
            .then()
            .statusCode(404)
            .body("error", containsString("Environment not found"))
            .body("status", is(404));

        long auditAfter = countAudit(TENANT_A, "PUBLISH_FAILURE");
        org.junit.jupiter.api.Assertions.assertEquals(auditBefore + 1, auditAfter);
    }

    @Test
    void publish_versionAlreadyPublished_returns409() {
        UUID artifactId = UUID.randomUUID();
        UUID versionId = UUID.randomUUID();
        String payloadKey = "tenant-" + TENANT_A + "/artifacts/process/" + artifactId + "/" + versionId + ".xml";
        seedArtifactWithVersion(TENANT_A, "PROCESS", artifactId, versionId, payloadKey, "PUBLISHED");

        long auditBefore = countAudit(TENANT_A, "PUBLISH_FAILURE");

        given()
            .contentType(ContentType.JSON)
            .body("{\"artifactId\":\"" + artifactId + "\",\"versionId\":\"" + versionId + "\",\"environmentId\":\"" + ENV_DEV + "\"}")
            .when()
            .post("/api/tenants/" + TENANT_A + "/publish")
            .then()
            .statusCode(409)
            .body("error", containsString("already published"))
            .body("status", is(409));

        long auditAfter = countAudit(TENANT_A, "PUBLISH_FAILURE");
        org.junit.jupiter.api.Assertions.assertEquals(auditBefore + 1, auditAfter);
    }

    @Test
    void publish_missingPayloadRef_returns409() {
        UUID artifactId = UUID.randomUUID();
        UUID versionId = UUID.randomUUID();
        seedArtifactWithVersion(TENANT_A, "PROCESS", artifactId, versionId, null, "DRAFT");

        long auditBefore = countAudit(TENANT_A, "PUBLISH_FAILURE");

        given()
            .contentType(ContentType.JSON)
            .body("{\"artifactId\":\"" + artifactId + "\",\"versionId\":\"" + versionId + "\",\"environmentId\":\"" + ENV_DEV + "\"}")
            .when()
            .post("/api/tenants/" + TENANT_A + "/publish")
            .then()
            .statusCode(409)
            .body("error", containsString("has no payloadRef"))
            .body("status", is(409));

        long auditAfter = countAudit(TENANT_A, "PUBLISH_FAILURE");
        org.junit.jupiter.api.Assertions.assertEquals(auditBefore + 1, auditAfter);
    }

    @Test
    void publish_invalidXml_returns400() {
        UUID artifactId = UUID.randomUUID();
        UUID versionId = UUID.randomUUID();
        String payloadKey = "tenant-" + TENANT_A + "/artifacts/process/" + artifactId + "/" + versionId + ".xml";
        seedArtifactWithVersion(TENANT_A, "PROCESS", artifactId, versionId, payloadKey, "DRAFT");
        s3.uploadBytes(s3.getArtifactsBucket(), payloadKey, "<definitions>".getBytes(), "application/xml");

        long auditBefore = countAudit(TENANT_A, "PUBLISH_FAILURE");

        given()
            .contentType(ContentType.JSON)
            .body("{\"artifactId\":\"" + artifactId + "\",\"versionId\":\"" + versionId + "\",\"environmentId\":\"" + ENV_DEV + "\"}")
            .when()
            .post("/api/tenants/" + TENANT_A + "/publish")
            .then()
            .statusCode(400)
            .body("error", containsString("Invalid XML payload"))
            .body("status", is(400));

        long auditAfter = countAudit(TENANT_A, "PUBLISH_FAILURE");
        org.junit.jupiter.api.Assertions.assertEquals(auditBefore + 1, auditAfter);
    }

    @Test
    void publish_invalidJson_returns400() {
        UUID artifactId = UUID.randomUUID();
        UUID versionId = UUID.randomUUID();
        String payloadKey = "tenant-" + TENANT_A + "/artifacts/form/" + artifactId + "/" + versionId + ".json";
        seedArtifactWithVersion(TENANT_A, "FORM", artifactId, versionId, payloadKey, "DRAFT");
        s3.uploadBytes(s3.getArtifactsBucket(), payloadKey, "{".getBytes(), "application/json");

        long auditBefore = countAudit(TENANT_A, "PUBLISH_FAILURE");

        given()
            .contentType(ContentType.JSON)
            .body("{\"artifactId\":\"" + artifactId + "\",\"versionId\":\"" + versionId + "\",\"environmentId\":\"" + ENV_DEV + "\"}")
            .when()
            .post("/api/tenants/" + TENANT_A + "/publish")
            .then()
            .statusCode(400)
            .body("error", containsString("Invalid JSON payload"))
            .body("status", is(400));

        long auditAfter = countAudit(TENANT_A, "PUBLISH_FAILURE");
        org.junit.jupiter.api.Assertions.assertEquals(auditBefore + 1, auditAfter);
    }

    @Test
    void publish_bundleAlreadyExists_returns409() {
        UUID artifactId = UUID.randomUUID();
        UUID versionId = UUID.randomUUID();
        String payloadKey = "tenant-" + TENANT_A + "/artifacts/process/" + artifactId + "/" + versionId + ".xml";
        String bundleKey = "tenant-" + TENANT_A + "/bundles/process/" + artifactId + "/" + versionId + ".zip";
        seedArtifactWithVersion(TENANT_A, "PROCESS", artifactId, versionId, payloadKey, "DRAFT");
        s3.uploadBytes(s3.getBundlesBucket(), bundleKey, "x".getBytes(), "application/zip");

        long auditBefore = countAudit(TENANT_A, "PUBLISH_FAILURE");

        given()
            .contentType(ContentType.JSON)
            .body("{\"artifactId\":\"" + artifactId + "\",\"versionId\":\"" + versionId + "\",\"environmentId\":\"" + ENV_DEV + "\"}")
            .when()
            .post("/api/tenants/" + TENANT_A + "/publish")
            .then()
            .statusCode(409)
            .body("error", containsString("Bundle already exists"))
            .body("status", is(409));

        long auditAfter = countAudit(TENANT_A, "PUBLISH_FAILURE");
        org.junit.jupiter.api.Assertions.assertEquals(auditBefore + 1, auditAfter);
    }

    @Test
    void getPublication_isTenantIsolated_returns404ForOtherTenant() {
        UUID artifactId = UUID.randomUUID();
        UUID versionId = UUID.randomUUID();
        String payloadKey = "tenant-" + TENANT_A + "/artifacts/process/" + artifactId + "/" + versionId + ".xml";
        seedArtifactWithVersion(TENANT_A, "PROCESS", artifactId, versionId, payloadKey, "DRAFT");
        s3.uploadBytes(s3.getArtifactsBucket(), payloadKey, "<definitions/>".getBytes(), "application/xml");

        String publicationId = given()
            .contentType(ContentType.JSON)
            .body("{\"artifactId\":\"" + artifactId + "\",\"versionId\":\"" + versionId + "\",\"environmentId\":\"" + ENV_DEV + "\"}")
            .when()
            .post("/api/tenants/" + TENANT_A + "/publish")
            .then()
            .statusCode(201)
            .body("id", notNullValue())
            .extract().path("id");

        given()
            .when()
            .get("/api/tenants/" + TENANT_B + "/publish/" + publicationId)
            .then()
            .statusCode(404)
            .body("error", containsString("Publication not found"))
            .body("status", is(404));
    }

    long countAudit(UUID tenantId, String action) {
        return ((Number) em.createNativeQuery(
                        "SELECT COUNT(*) FROM audit_log WHERE tenant_id = :tid AND action = :a")
                .setParameter("tid", tenantId)
                .setParameter("a", action)
                .getSingleResult()).longValue();
    }

    @Transactional
    void seedArtifactWithVersion(
            UUID tenantId,
            String type,
            UUID artifactId,
            UUID versionId,
            String payloadRef,
            String state) {
        em.createNativeQuery("SELECT set_config('app.current_tenant', :tid, true)")
            .setParameter("tid", tenantId.toString())
            .getSingleResult();

        em.createNativeQuery(
                "INSERT INTO artifact (id, tenant_id, type, title, status) VALUES (:id, :tid, :type, 't', 'DRAFT')")
            .setParameter("id", artifactId)
            .setParameter("tid", tenantId)
            .setParameter("type", type)
            .executeUpdate();

        em.createNativeQuery(
                "INSERT INTO artifact_version (id, artifact_id, version, state, payload_ref) VALUES (:vid, :aid, '1.0.0', :state, :pref)")
            .setParameter("vid", versionId)
            .setParameter("aid", artifactId)
            .setParameter("state", state)
            .setParameter("pref", payloadRef)
            .executeUpdate();
    }
}
