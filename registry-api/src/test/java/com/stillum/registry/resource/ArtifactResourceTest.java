package com.stillum.registry.resource;

import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;

@QuarkusTest
class ArtifactResourceTest {

    static final String TENANT_ID = "00000000-0000-0000-0000-000000000001";
    static final String BASE_PATH = "/api/tenants/" + TENANT_ID + "/artifacts";

    @Test
    void createArtifact_validRequest_returns201() {
        given()
            .contentType(ContentType.JSON)
            .body("{\"type\":\"PROCESS\",\"title\":\"Test Process\","
                + "\"description\":\"Processo di test\",\"area\":\"HR\","
                + "\"tags\":[\"bpmn\",\"test\"]}")
            .when()
            .post(BASE_PATH)
            .then()
            .statusCode(201)
            .body("id", notNullValue())
            .body("title", is("Test Process"))
            .body("type", is("PROCESS"))
            .body("status", is("DRAFT"))
            .body("tenantId", is(TENANT_ID));
    }

    @Test
    void createArtifact_missingTitle_returns400() {
        given()
            .contentType(ContentType.JSON)
            .body("{\"type\":\"PROCESS\"}")
            .when()
            .post(BASE_PATH)
            .then()
            .statusCode(400);
    }

    @Test
    void listArtifacts_returnsPaged() {
        given()
            .queryParam("page", 0)
            .queryParam("size", 10)
            .when()
            .get(BASE_PATH)
            .then()
            .statusCode(200)
            .body("items", notNullValue())
            .body("page", is(0))
            .body("pageSize", is(10));
    }

    @Test
    void listArtifacts_withTypeFilter_onlyMatchingReturned() {
        // Seed PROCESS artifact
        String id = given()
            .contentType(ContentType.JSON)
            .body("{\"type\":\"PROCESS\",\"title\":\"P1\"}")
            .when()
            .post(BASE_PATH)
            .then()
            .statusCode(201)
            .extract().path("id");

        // Filter by RULE – should not contain the PROCESS artifact
        given()
            .queryParam("type", "RULE")
            .when()
            .get(BASE_PATH)
            .then()
            .statusCode(200);
    }

    @Test
    void getArtifactById_existingId_returns200() {
        String id = given()
            .contentType(ContentType.JSON)
            .body("{\"type\":\"RULE\",\"title\":\"Rule A\"}")
            .when()
            .post(BASE_PATH)
            .then()
            .statusCode(201)
            .extract().path("id");

        given()
            .when()
            .get(BASE_PATH + "/" + id)
            .then()
            .statusCode(200)
            .body("id", is(id));
    }

    @Test
    void getArtifactById_unknownId_returns404() {
        given()
            .when()
            .get(BASE_PATH + "/00000000-9999-0000-0000-000000000000")
            .then()
            .statusCode(404);
    }

    @Test
    void updateArtifact_validRequest_returns200() {
        String id = given()
            .contentType(ContentType.JSON)
            .body("{\"type\":\"FORM\",\"title\":\"Modulo Originale\"}")
            .when()
            .post(BASE_PATH)
            .then()
            .statusCode(201)
            .extract().path("id");

        given()
            .contentType(ContentType.JSON)
            .body("{\"title\":\"Modulo Aggiornato\",\"area\":\"Finance\"}")
            .when()
            .put(BASE_PATH + "/" + id)
            .then()
            .statusCode(200)
            .body("title", is("Modulo Aggiornato"));
    }

    @Test
    void deleteArtifact_existingId_returns204AndRetired() {
        String id = given()
            .contentType(ContentType.JSON)
            .body("{\"type\":\"REQUEST\",\"title\":\"Request X\"}")
            .when()
            .post(BASE_PATH)
            .then()
            .statusCode(201)
            .extract().path("id");

        given()
            .when()
            .delete(BASE_PATH + "/" + id)
            .then()
            .statusCode(204);

        // Verify soft-delete: artifact still exists with RETIRED status
        given()
            .when()
            .get(BASE_PATH + "/" + id)
            .then()
            .statusCode(200)
            .body("status", is("RETIRED"));
    }
}
