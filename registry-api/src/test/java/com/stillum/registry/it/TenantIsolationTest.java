package com.stillum.registry.it;

import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.everyItem;
import static org.hamcrest.Matchers.is;

/**
 * Verifica l'isolamento dati multi-tenant:
 * un tenant non deve poter vedere gli artefatti di un altro tenant.
 */
@QuarkusTest
class TenantIsolationTest {

    static final String TENANT_A = "00000000-0000-0000-0000-000000000001";
    static final String TENANT_B = "00000000-0000-0000-0000-000000000002";

    @Test
    void tenantA_cannotSeeArtifactsOfTenantB() {
        // Crea artefatto per tenant B (seed via API)
        given()
            .contentType(ContentType.JSON)
            .body("{\"type\":\"PROCESS\",\"title\":\"Tenant B Process\"}")
            .when()
            .post("/api/tenants/" + TENANT_B + "/artifacts")
            .then()
            .statusCode(201);

        // Tenant A elenca i suoi artefatti: non deve vedere quelli di B
        given()
            .when()
            .get("/api/tenants/" + TENANT_A + "/artifacts")
            .then()
            .statusCode(200)
            .body("items.tenantId", everyItem(is(TENANT_A)));
    }

    @Test
    void tenantA_cannotGetArtifactOfTenantB_by_id() {
        // Crea artefatto per tenant B
        String artifactId = given()
            .contentType(ContentType.JSON)
            .body("{\"type\":\"RULE\",\"title\":\"B Private Rule\"}")
            .when()
            .post("/api/tenants/" + TENANT_B + "/artifacts")
            .then()
            .statusCode(201)
            .extract().path("id");

        // Tenant A tenta di accedere all'ID di B → deve ricevere 404
        given()
            .when()
            .get("/api/tenants/" + TENANT_A + "/artifacts/" + artifactId)
            .then()
            .statusCode(404);
    }
}
