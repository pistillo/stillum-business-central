package com.stillum.registry.resource;

import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.hasKey;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;

@QuarkusTest
class ModuleBuildSnapshotTest {

    static final String TENANT_ID =
            "00000000-0000-0000-0000-000000000001";
    static final String BASE =
            "/api/tenants/" + TENANT_ID + "/artifacts";

    @Test
    void createModule_generatesBuildSnapshot() {
        // 1. Crea un modulo con port e keywords
        String moduleId = given()
            .contentType(ContentType.JSON)
            .body("""
                {
                  "title": "snapshot-test-module",
                  "description": "Modulo di test per snapshot",
                  "area": "QA",
                  "tags": ["test", "snapshot"],
                  "port": "5010",
                  "keywords": "forms,react,snapshot"
                }
                """)
            .when()
            .post(BASE + "/modules")
            .then()
            .statusCode(201)
            .body("id", notNullValue())
            .body("type", is("MODULE"))
            .extract().path("id");

        // 2. Recupera il workspace per leggere la versione con snapshot
        given()
            .when()
            .get(BASE + "/" + moduleId + "/workspace")
            .then()
            .statusCode(200)
            .body("module.id", is(moduleId))
            .body("moduleVersion", notNullValue())
            .body("moduleVersion.version", is("0.1.0"))
            .body("moduleVersion.buildSnapshot", notNullValue())
            .body("moduleVersion.buildSnapshot.templateVersion",
                    is("1.0.0"))
            // Verifica inputs
            .body("moduleVersion.buildSnapshot.inputs.name",
                    is("snapshot-test-module"))
            .body("moduleVersion.buildSnapshot.inputs.description",
                    is("Modulo di test per snapshot"))
            .body("moduleVersion.buildSnapshot.inputs.port",
                    is("5010"))
            .body("moduleVersion.buildSnapshot.inputs.keywords",
                    is("forms,react,snapshot"))
            // Verifica che i file principali siano presenti
            .body("moduleVersion.buildSnapshot.files",
                    hasKey("package.json"))
            .body("moduleVersion.buildSnapshot.files",
                    hasKey("tsconfig.json"))
            .body("moduleVersion.buildSnapshot.files",
                    hasKey("webpack.config.js"))
            .body("moduleVersion.buildSnapshot.files",
                    hasKey(".storybook/main.ts"))
            .body("moduleVersion.buildSnapshot.files",
                    hasKey("src/index.tsx"))
            // Verifica la risoluzione dei placeholder
            .body("moduleVersion.buildSnapshot.files.'package.json'",
                    containsString("@tecnosys/snapshot-test-module"))
            .body("moduleVersion.buildSnapshot.files.'webpack.config.js'",
                    containsString("port: 5010"))
            .body("moduleVersion.buildSnapshot.files.'webpack.config.js'",
                    containsString("snapshot_test_module"))
            .body("moduleVersion.buildSnapshot.files.'package.json'",
                    containsString("\"forms\""))
            .body("moduleVersion.buildSnapshot.files.'src/App.tsx'",
                    containsString("Modulo di test per snapshot"));
    }

    @Test
    void createModule_defaultPort_usedWhenOmitted() {
        String moduleId = given()
            .contentType(ContentType.JSON)
            .body("""
                {
                  "title": "no-port-module",
                  "description": "Senza porta"
                }
                """)
            .when()
            .post(BASE + "/modules")
            .then()
            .statusCode(201)
            .extract().path("id");

        given()
            .when()
            .get(BASE + "/" + moduleId + "/workspace")
            .then()
            .statusCode(200)
            .body("moduleVersion.buildSnapshot.inputs.port",
                    is("5002"))
            .body("moduleVersion.buildSnapshot.files.'webpack.config.js'",
                    containsString("port: 5002"));
    }
}
