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
    void createModule_generatesFilesInWorkspace() {
        // 1. Create a module with port and keywords
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

        // 2. Fetch the workspace to read the version with files
        given()
            .when()
            .get(BASE + "/" + moduleId + "/workspace")
            .then()
            .statusCode(200)
            .body("module.id", is(moduleId))
            .body("moduleVersion", notNullValue())
            .body("moduleVersion.version", is("0.1.0"))
            // Verify that the main template files are present
            .body("moduleVersion.files", notNullValue())
            .body("moduleVersion.files",
                    hasKey("package.json"))
            .body("moduleVersion.files",
                    hasKey("tsconfig.json"))
            .body("moduleVersion.files",
                    hasKey("webpack.config.js"))
            .body("moduleVersion.files",
                    hasKey("src/App.tsx"))
            .body("moduleVersion.files",
                    hasKey("src/index.tsx"))
            // Verify placeholder resolution in file content
            .body("moduleVersion.files.'package.json'",
                    containsString("@tecnosys/snapshot-test-module"))
            .body("moduleVersion.files.'webpack.config.js'",
                    containsString("port: 5010"))
            .body("moduleVersion.files.'webpack.config.js'",
                    containsString("snapshot_test_module"))
            .body("moduleVersion.files.'package.json'",
                    containsString("\"forms\""))
            .body("moduleVersion.files.'src/App.tsx'",
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
            .body("moduleVersion.files.'webpack.config.js'",
                    containsString("port: 5002"));
    }
}
