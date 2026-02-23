package com.stillum.registry.resource;

import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;

@QuarkusTest
class EnvironmentResourceTest {

    static final String TENANT_A = "00000000-0000-0000-0000-000000000001";
    static final String TENANT_B = "00000000-0000-0000-0000-000000000002";

    static final String BASE_A = "/api/tenants/" + TENANT_A + "/environments";
    static final String BASE_B = "/api/tenants/" + TENANT_B + "/environments";

    @Test
    void listEnvironments_seededTenant_hasDefaultEnvironments() {
        given()
            .when()
            .get(BASE_A)
            .then()
            .statusCode(200)
            .body("$", hasSize(3));
    }

    @Test
    void environmentCrud_createUpdateDelete_works() {
        String envId = given()
            .contentType(ContentType.JSON)
            .body("{\"name\":\"STAGE\",\"description\":\"Staging\"}")
            .when()
            .post(BASE_B)
            .then()
            .statusCode(201)
            .body("id", notNullValue())
            .body("tenantId", equalTo(TENANT_B))
            .body("name", equalTo("STAGE"))
            .extract().path("id");

        given()
            .when()
            .get(BASE_B + "/" + envId)
            .then()
            .statusCode(200)
            .body("id", equalTo(envId))
            .body("tenantId", equalTo(TENANT_B))
            .body("name", equalTo("STAGE"));

        given()
            .contentType(ContentType.JSON)
            .body("{\"name\":\"STAGE2\",\"description\":\"Staging v2\"}")
            .when()
            .put(BASE_B + "/" + envId)
            .then()
            .statusCode(200)
            .body("name", equalTo("STAGE2"))
            .body("description", equalTo("Staging v2"));

        given()
            .when()
            .delete(BASE_B + "/" + envId)
            .then()
            .statusCode(204);

        given()
            .when()
            .get(BASE_B + "/" + envId)
            .then()
            .statusCode(404);
    }

    @Test
    void environments_areIsolatedAcrossTenants() {
        given()
            .when()
            .get(BASE_B)
            .then()
            .statusCode(200)
            .body("$", hasSize(0));

        given()
            .when()
            .get(BASE_B + "/00000000-0000-0000-0000-000000000020")
            .then()
            .statusCode(404)
            .body("status", is(404));
    }
}

