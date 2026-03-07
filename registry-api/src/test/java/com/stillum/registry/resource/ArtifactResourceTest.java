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

    // ── Generic artifact CRUD ──

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
        given()
            .contentType(ContentType.JSON)
            .body("{\"type\":\"PROCESS\",\"title\":\"P1\"}")
            .when()
            .post(BASE_PATH)
            .then()
            .statusCode(201);

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
            .contentType(ContentType.JSON)
            .body("{\"version\":\"1.0.0\"}")
            .when()
            .post(BASE_PATH + "/" + id + "/versions")
            .then()
            .statusCode(201);

        given()
            .when()
            .get(BASE_PATH + "/" + id)
            .then()
            .statusCode(200)
            .body("id", is(id))
            .body("versions.size()", is(1))
            .body("versions[0].version", is("1.0.0"));
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

        given()
            .when()
            .get(BASE_PATH + "/" + id)
            .then()
            .statusCode(200)
            .body("status", is("RETIRED"));
    }

    // ── MODULE tests ──

    @Test
    void createModule_validRequest_returns201() {
        given()
            .contentType(ContentType.JSON)
            .body("{\"title\":\"Test Module\","
                + "\"description\":\"Module for testing\","
                + "\"area\":\"UI\","
                + "\"tags\":[\"react\",\"test\"]}")
            .when()
            .post(BASE_PATH + "/modules")
            .then()
            .statusCode(201)
            .body("id", notNullValue())
            .body("title", is("Test Module"))
            .body("type", is("MODULE"))
            .body("status", is("DRAFT"))
            .body("tenantId", is(TENANT_ID));
    }

    @Test
    void createModule_autoCreatesVersionWithFiles() {
        String moduleId = given()
            .contentType(ContentType.JSON)
            .body("{\"title\":\"Module AutoVer\"}")
            .when()
            .post(BASE_PATH + "/modules")
            .then()
            .statusCode(201)
            .extract().path("id");

        // The module should have auto-created version 0.1.0 with files
        given()
            .when()
            .get(BASE_PATH + "/" + moduleId + "/versions")
            .then()
            .statusCode(200)
            .body("size()", is(1))
            .body("[0].version", is("0.1.0"))
            .body("[0].state", is("DRAFT"))
            .body("[0].files", notNullValue());
    }

    @Test
    void createModule_versionHasTemplateFiles() {
        String moduleId = given()
            .contentType(ContentType.JSON)
            .body("{\"title\":\"Module Snapshot\"}")
            .when()
            .post(BASE_PATH + "/modules")
            .then()
            .statusCode(201)
            .extract().path("id");

        given()
            .when()
            .get(BASE_PATH + "/" + moduleId + "/versions")
            .then()
            .statusCode(200)
            .body("[0].files", notNullValue());
    }

    @Test
    void createModule_missingTitle_returns400() {
        given()
            .contentType(ContentType.JSON)
            .body("{\"description\":\"No title\"}")
            .when()
            .post(BASE_PATH + "/modules")
            .then()
            .statusCode(400);
    }

    // ── COMPONENT tests ──

    @Test
    void createComponent_droplets_returns201() {
        String moduleId = given()
            .contentType(ContentType.JSON)
            .body("{\"title\":\"Parent Droplets\"}")
            .when()
            .post(BASE_PATH + "/modules")
            .then()
            .statusCode(201)
            .extract().path("id");

        given()
            .contentType(ContentType.JSON)
            .body("{\"title\":\"TestDroplet\","
                + "\"description\":\"A droplet component\","
                + "\"area\":\"droplets\","
                + "\"tags\":[\"react\"],"
                + "\"parentModuleId\":\"" + moduleId + "\"}")
            .when()
            .post(BASE_PATH + "/components")
            .then()
            .statusCode(201)
            .body("id", notNullValue())
            .body("title", is("TestDroplet"))
            .body("type", is("COMPONENT"))
            .body("area", is("droplets"))
            .body("status", is("DRAFT"))
            .body("tenantId", is(TENANT_ID));
    }

    @Test
    void createComponent_autoCreatesVersionWithFiles() {
        String moduleId = given()
            .contentType(ContentType.JSON)
            .body("{\"title\":\"Parent CompVer\"}")
            .when()
            .post(BASE_PATH + "/modules")
            .then()
            .statusCode(201)
            .extract().path("id");

        String componentId = given()
            .contentType(ContentType.JSON)
            .body("{\"title\":\"CompWithVersion\","
                + "\"area\":\"pools\","
                + "\"parentModuleId\":\"" + moduleId + "\"}")
            .when()
            .post(BASE_PATH + "/components")
            .then()
            .statusCode(201)
            .extract().path("id");

        given()
            .when()
            .get(BASE_PATH + "/" + componentId + "/versions")
            .then()
            .statusCode(200)
            .body("size()", is(1))
            .body("[0].version", is("0.1.0"))
            .body("[0].state", is("DRAFT"))
            .body("[0].files", notNullValue());
    }

    @Test
    void createComponent_versionHasFiles() {
        String moduleId = given()
            .contentType(ContentType.JSON)
            .body("{\"title\":\"Parent CompFiles\"}")
            .when()
            .post(BASE_PATH + "/modules")
            .then()
            .statusCode(201)
            .extract().path("id");

        String componentId = given()
            .contentType(ContentType.JSON)
            .body("{\"title\":\"CompFiles\","
                + "\"area\":\"droplets\","
                + "\"parentModuleId\":\"" + moduleId + "\"}")
            .when()
            .post(BASE_PATH + "/components")
            .then()
            .statusCode(201)
            .extract().path("id");

        given()
            .when()
            .get(BASE_PATH + "/" + componentId + "/versions")
            .then()
            .statusCode(200)
            .body("[0].files", notNullValue());
    }

    @Test
    void createComponent_missingArea_returns400() {
        String moduleId = given()
            .contentType(ContentType.JSON)
            .body("{\"title\":\"Parent NoArea\"}")
            .when()
            .post(BASE_PATH + "/modules")
            .then()
            .statusCode(201)
            .extract().path("id");

        given()
            .contentType(ContentType.JSON)
            .body("{\"title\":\"Test Component\","
                + "\"parentModuleId\":\"" + moduleId + "\"}")
            .when()
            .post(BASE_PATH + "/components")
            .then()
            .statusCode(400);
    }

    @Test
    void createComponent_missingParentModuleId_returns400() {
        given()
            .contentType(ContentType.JSON)
            .body("{\"title\":\"Test Component\","
                + "\"area\":\"droplets\"}")
            .when()
            .post(BASE_PATH + "/components")
            .then()
            .statusCode(400);
    }

    @Test
    void createComponent_nonExistentParentModule_returns400() {
        given()
            .contentType(ContentType.JSON)
            .body("{\"title\":\"Test Component\","
                + "\"area\":\"droplets\","
                + "\"parentModuleId\":\"00000000-9999-0000-0000-000000000000\"}")
            .when()
            .post(BASE_PATH + "/components")
            .then()
            .statusCode(400);
    }

    // ── WORKSPACE test ──

    @Test
    void getWorkspace_returnsModuleAndComponents() {
        String moduleId = given()
            .contentType(ContentType.JSON)
            .body("{\"title\":\"Workspace Module\"}")
            .when()
            .post(BASE_PATH + "/modules")
            .then()
            .statusCode(201)
            .extract().path("id");

        given()
            .contentType(ContentType.JSON)
            .body("{\"title\":\"WsDroplet\","
                + "\"area\":\"droplets\","
                + "\"parentModuleId\":\"" + moduleId + "\"}")
            .when()
            .post(BASE_PATH + "/components")
            .then()
            .statusCode(201);

        given()
            .when()
            .get(BASE_PATH + "/" + moduleId + "/workspace")
            .then()
            .statusCode(200)
            .body("module", notNullValue())
            .body("module.id", is(moduleId))
            .body("module.type", is("MODULE"))
            .body("moduleVersion", notNullValue())
            .body("moduleVersion.version", is("0.1.0"))
            .body("moduleVersion.files", notNullValue())
            .body("components.size()", is(1))
            .body("components[0].artifact.type", is("COMPONENT"))
            .body("components[0].artifact.area", is("droplets"))
            .body("components[0].version.version", is("0.1.0"))
            .body("components[0].version.files", notNullValue());
    }
}
