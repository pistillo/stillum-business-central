package com.stillum.registry.resource;

import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.is;

@QuarkusTest
class HealthResourceTest {

    @Test
    void health() {
        given()
                .when().get("/api/health")
                .then()
                .statusCode(200)
                .body(is("ok"));
    }
}
