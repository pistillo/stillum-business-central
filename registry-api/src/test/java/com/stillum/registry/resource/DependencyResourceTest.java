package com.stillum.registry.resource;

import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;

@QuarkusTest
class DependencyResourceTest {

    static final String TENANT_A = "00000000-0000-0000-0000-000000000001";
    static final String TENANT_B = "00000000-0000-0000-0000-000000000002";

    static final String ARTIFACTS_A = "/api/tenants/" + TENANT_A + "/artifacts";
    static final String ARTIFACTS_B = "/api/tenants/" + TENANT_B + "/artifacts";

    @Test
    void dependencies_addListDelete_work() {
        String a1 = given()
            .contentType(ContentType.JSON)
            .body("{\"type\":\"PROCESS\",\"title\":\"A1\"}")
            .when()
            .post(ARTIFACTS_A)
            .then()
            .statusCode(201)
            .extract().path("id");

        String v1 = given()
            .contentType(ContentType.JSON)
            .body("{\"version\":\"1.0.0\"}")
            .when()
            .post(ARTIFACTS_A + "/" + a1 + "/versions")
            .then()
            .statusCode(201)
            .extract().path("id");

        String a2 = given()
            .contentType(ContentType.JSON)
            .body("{\"type\":\"PROCESS\",\"title\":\"A2\"}")
            .when()
            .post(ARTIFACTS_A)
            .then()
            .statusCode(201)
            .extract().path("id");

        String v2 = given()
            .contentType(ContentType.JSON)
            .body("{\"version\":\"1.0.0\"}")
            .when()
            .post(ARTIFACTS_A + "/" + a2 + "/versions")
            .then()
            .statusCode(201)
            .extract().path("id");

        String base = ARTIFACTS_A + "/" + a1 + "/versions/" + v1 + "/dependencies";

        String depId = given()
            .contentType(ContentType.JSON)
            .body("{\"dependsOnArtifactId\":\"" + a2 + "\",\"dependsOnVersionId\":\"" + v2 + "\"}")
            .when()
            .post(base)
            .then()
            .statusCode(201)
            .body("id", notNullValue())
            .body("artifactVersionId", equalTo(v1))
            .body("dependsOnArtifactId", equalTo(a2))
            .body("dependsOnVersionId", equalTo(v2))
            .extract().path("id");

        given()
            .when()
            .get(base)
            .then()
            .statusCode(200)
            .body("$", hasSize(1))
            .body("[0].id", equalTo(depId));

        given()
            .when()
            .delete(base + "/" + depId)
            .then()
            .statusCode(204);

        given()
            .when()
            .get(base)
            .then()
            .statusCode(200)
            .body("$", hasSize(0));
    }

    @Test
    void dependencies_duplicate_returns400() {
        String a1 = given()
            .contentType(ContentType.JSON)
            .body("{\"type\":\"PROCESS\",\"title\":\"A1\"}")
            .when()
            .post(ARTIFACTS_A)
            .then()
            .statusCode(201)
            .extract().path("id");

        String v1 = given()
            .contentType(ContentType.JSON)
            .body("{\"version\":\"1.0.0\"}")
            .when()
            .post(ARTIFACTS_A + "/" + a1 + "/versions")
            .then()
            .statusCode(201)
            .extract().path("id");

        String a2 = given()
            .contentType(ContentType.JSON)
            .body("{\"type\":\"PROCESS\",\"title\":\"A2\"}")
            .when()
            .post(ARTIFACTS_A)
            .then()
            .statusCode(201)
            .extract().path("id");

        String v2 = given()
            .contentType(ContentType.JSON)
            .body("{\"version\":\"1.0.0\"}")
            .when()
            .post(ARTIFACTS_A + "/" + a2 + "/versions")
            .then()
            .statusCode(201)
            .extract().path("id");

        String base = ARTIFACTS_A + "/" + a1 + "/versions/" + v1 + "/dependencies";

        given()
            .contentType(ContentType.JSON)
            .body("{\"dependsOnArtifactId\":\"" + a2 + "\",\"dependsOnVersionId\":\"" + v2 + "\"}")
            .when()
            .post(base)
            .then()
            .statusCode(201);

        given()
            .contentType(ContentType.JSON)
            .body("{\"dependsOnArtifactId\":\"" + a2 + "\",\"dependsOnVersionId\":\"" + v2 + "\"}")
            .when()
            .post(base)
            .then()
            .statusCode(400)
            .body("error", containsString("Dependency already exists"))
            .body("status", is(400));
    }

    @Test
    void dependencies_cycleDetected_returns409() {
        String a1 = given()
            .contentType(ContentType.JSON)
            .body("{\"type\":\"PROCESS\",\"title\":\"A1\"}")
            .when()
            .post(ARTIFACTS_A)
            .then()
            .statusCode(201)
            .extract().path("id");

        String v1 = given()
            .contentType(ContentType.JSON)
            .body("{\"version\":\"1.0.0\"}")
            .when()
            .post(ARTIFACTS_A + "/" + a1 + "/versions")
            .then()
            .statusCode(201)
            .extract().path("id");

        String a2 = given()
            .contentType(ContentType.JSON)
            .body("{\"type\":\"PROCESS\",\"title\":\"A2\"}")
            .when()
            .post(ARTIFACTS_A)
            .then()
            .statusCode(201)
            .extract().path("id");

        String v2 = given()
            .contentType(ContentType.JSON)
            .body("{\"version\":\"1.0.0\"}")
            .when()
            .post(ARTIFACTS_A + "/" + a2 + "/versions")
            .then()
            .statusCode(201)
            .extract().path("id");

        given()
            .contentType(ContentType.JSON)
            .body("{\"dependsOnArtifactId\":\"" + a2 + "\",\"dependsOnVersionId\":\"" + v2 + "\"}")
            .when()
            .post(ARTIFACTS_A + "/" + a1 + "/versions/" + v1 + "/dependencies")
            .then()
            .statusCode(201);

        given()
            .contentType(ContentType.JSON)
            .body("{\"dependsOnArtifactId\":\"" + a1 + "\",\"dependsOnVersionId\":\"" + v1 + "\"}")
            .when()
            .post(ARTIFACTS_A + "/" + a2 + "/versions/" + v2 + "/dependencies")
            .then()
            .statusCode(409)
            .body("error", containsString("create a cycle"))
            .body("status", is(409));
    }

    @Test
    void dependencies_crossTenantReference_returns404() {
        String rootArtifactId = given()
            .contentType(ContentType.JSON)
            .body("{\"type\":\"PROCESS\",\"title\":\"Root\"}")
            .when()
            .post(ARTIFACTS_A)
            .then()
            .statusCode(201)
            .extract().path("id");

        String rootVersionId = given()
            .contentType(ContentType.JSON)
            .body("{\"version\":\"1.0.0\"}")
            .when()
            .post(ARTIFACTS_A + "/" + rootArtifactId + "/versions")
            .then()
            .statusCode(201)
            .extract().path("id");

        String depArtifactId = given()
            .contentType(ContentType.JSON)
            .body("{\"type\":\"PROCESS\",\"title\":\"Dep\"}")
            .when()
            .post(ARTIFACTS_B)
            .then()
            .statusCode(201)
            .extract().path("id");

        String depVersionId = given()
            .contentType(ContentType.JSON)
            .body("{\"version\":\"1.0.0\"}")
            .when()
            .post(ARTIFACTS_B + "/" + depArtifactId + "/versions")
            .then()
            .statusCode(201)
            .extract().path("id");

        given()
            .contentType(ContentType.JSON)
            .body("{\"dependsOnArtifactId\":\"" + depArtifactId + "\",\"dependsOnVersionId\":\"" + depVersionId + "\"}")
            .when()
            .post(ARTIFACTS_A + "/" + rootArtifactId + "/versions/" + rootVersionId + "/dependencies")
            .then()
            .statusCode(404)
            .body("status", is(404));
    }
}
