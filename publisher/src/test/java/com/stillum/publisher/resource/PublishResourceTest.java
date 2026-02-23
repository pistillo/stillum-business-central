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
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;

@QuarkusTest
class PublishResourceTest {

    static final UUID TENANT_ID = UUID.fromString("00000000-0000-0000-0000-000000000001");
    static final UUID ENV_DEV = UUID.fromString("00000000-0000-0000-0000-000000000020");

    @Inject
    EntityManager em;

    @Inject
    S3StorageClient s3;

    @Test
    void publish_happyPath_createsBundlePublicationAndAudit() {
        UUID artifactId = UUID.randomUUID();
        UUID versionId = UUID.randomUUID();
        String payloadKey = "tenant-" + TENANT_ID + "/artifacts/process/" + artifactId + "/" + versionId + ".xml";

        seedArtifactWithVersion(artifactId, versionId, payloadKey, "DRAFT");
        s3.uploadBytes(s3.getArtifactsBucket(), payloadKey, "<definitions/>".getBytes(), "application/xml");

        String publicationId = given()
            .contentType(ContentType.JSON)
            .body("{\"artifactId\":\"" + artifactId + "\",\"versionId\":\"" + versionId + "\",\"environmentId\":\"" + ENV_DEV + "\",\"notes\":\"r1\"}")
            .when()
            .post("/api/tenants/" + TENANT_ID + "/publish")
            .then()
            .statusCode(201)
            .body("id", notNullValue())
            .body("tenantId", equalTo(TENANT_ID.toString()))
            .body("artifactId", equalTo(artifactId.toString()))
            .body("versionId", equalTo(versionId.toString()))
            .body("environmentId", equalTo(ENV_DEV.toString()))
            .body("bundleRef", containsString("/bundles/process/"))
            .extract().path("id");

        String bundleRef = given()
            .when()
            .get("/api/tenants/" + TENANT_ID + "/publish/" + publicationId)
            .then()
            .statusCode(200)
            .body("id", equalTo(publicationId))
            .body("bundleRef", notNullValue())
            .extract().path("bundleRef");

        boolean bundleExists = s3.exists(s3.getBundlesBucket(), bundleRef);
        org.junit.jupiter.api.Assertions.assertTrue(bundleExists);

        String state = (String) em.createNativeQuery("SELECT state FROM artifact_version WHERE id = :id")
            .setParameter("id", versionId)
            .getSingleResult();
        org.junit.jupiter.api.Assertions.assertEquals("PUBLISHED", state);

        Number pubCount = (Number) em.createNativeQuery("SELECT COUNT(*) FROM publication WHERE id = :id")
            .setParameter("id", UUID.fromString(publicationId))
            .getSingleResult();
        org.junit.jupiter.api.Assertions.assertEquals(1L, pubCount.longValue());

        Number auditCount = (Number) em.createNativeQuery("SELECT COUNT(*) FROM audit_log WHERE tenant_id = :tid AND action = 'PUBLISH_SUCCESS'")
            .setParameter("tid", TENANT_ID)
            .getSingleResult();
        org.junit.jupiter.api.Assertions.assertEquals(1L, auditCount.longValue());
    }

    @Test
    void publish_failsWhenDependencyNotPublished_writesFailureAudit() {
        UUID rootArtifactId = UUID.randomUUID();
        UUID rootVersionId = UUID.randomUUID();
        String rootPayloadKey = "tenant-" + TENANT_ID + "/artifacts/process/" + rootArtifactId + "/" + rootVersionId + ".xml";

        UUID depArtifactId = UUID.randomUUID();
        UUID depVersionId = UUID.randomUUID();
        String depPayloadKey = "tenant-" + TENANT_ID + "/artifacts/process/" + depArtifactId + "/" + depVersionId + ".xml";

        seedArtifactWithVersion(rootArtifactId, rootVersionId, rootPayloadKey, "DRAFT");
        seedArtifactWithVersion(depArtifactId, depVersionId, depPayloadKey, "DRAFT");
        seedDependency(rootVersionId, depArtifactId, depVersionId);

        s3.uploadBytes(s3.getArtifactsBucket(), rootPayloadKey, "<definitions/>".getBytes(), "application/xml");
        s3.uploadBytes(s3.getArtifactsBucket(), depPayloadKey, "<definitions/>".getBytes(), "application/xml");

        given()
            .contentType(ContentType.JSON)
            .body("{\"artifactId\":\"" + rootArtifactId + "\",\"versionId\":\"" + rootVersionId + "\",\"environmentId\":\"" + ENV_DEV + "\"}")
            .when()
            .post("/api/tenants/" + TENANT_ID + "/publish")
            .then()
            .statusCode(409)
            .body("error", containsString("Dependency version not published"));

        String state = (String) em.createNativeQuery("SELECT state FROM artifact_version WHERE id = :id")
            .setParameter("id", rootVersionId)
            .getSingleResult();
        org.junit.jupiter.api.Assertions.assertEquals("DRAFT", state);

        Number pubCount = (Number) em.createNativeQuery("SELECT COUNT(*) FROM publication WHERE artifact_version_id = :id")
            .setParameter("id", rootVersionId)
            .getSingleResult();
        org.junit.jupiter.api.Assertions.assertEquals(0L, pubCount.longValue());

        Number auditCount = (Number) em.createNativeQuery("SELECT COUNT(*) FROM audit_log WHERE tenant_id = :tid AND action = 'PUBLISH_FAILURE'")
            .setParameter("tid", TENANT_ID)
            .getSingleResult();
        org.junit.jupiter.api.Assertions.assertEquals(1L, auditCount.longValue());
    }

    @Transactional
    void seedArtifactWithVersion(UUID artifactId, UUID versionId, String payloadRef, String state) {
        em.createNativeQuery("SELECT set_config('app.current_tenant', :tid, true)")
            .setParameter("tid", TENANT_ID.toString())
            .getSingleResult();

        em.createNativeQuery(
                "INSERT INTO artifact (id, tenant_id, type, title, status) VALUES (:id, :tid, 'PROCESS', 't', 'DRAFT')")
            .setParameter("id", artifactId)
            .setParameter("tid", TENANT_ID)
            .executeUpdate();

        em.createNativeQuery(
                "INSERT INTO artifact_version (id, artifact_id, version, state, payload_ref) VALUES (:vid, :aid, '1.0.0', :state, :pref)")
            .setParameter("vid", versionId)
            .setParameter("aid", artifactId)
            .setParameter("state", state)
            .setParameter("pref", payloadRef)
            .executeUpdate();
    }

    @Transactional
    void seedDependency(UUID rootVersionId, UUID dependsOnArtifactId, UUID dependsOnVersionId) {
        em.createNativeQuery("SELECT set_config('app.current_tenant', :tid, true)")
            .setParameter("tid", TENANT_ID.toString())
            .getSingleResult();

        em.createNativeQuery(
                "INSERT INTO dependency (artifact_version_id, depends_on_artifact_id, depends_on_version_id) VALUES (:vid, :aid, :dvid)")
            .setParameter("vid", rootVersionId)
            .setParameter("aid", dependsOnArtifactId)
            .setParameter("dvid", dependsOnVersionId)
            .executeUpdate();
    }
}

