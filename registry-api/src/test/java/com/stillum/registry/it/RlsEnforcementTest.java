package test.java.com.stillum.registry.it;

import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import java.util.UUID;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.junit.jupiter.api.Assertions.assertEquals;

@QuarkusTest
class RlsEnforcementTest {

    static final UUID TENANT_A = UUID.fromString("00000000-0000-0000-0000-000000000001");
    static final UUID TENANT_B = UUID.fromString("00000000-0000-0000-0000-000000000002");

    @Inject
    EntityManager em;

    @Test
    @Transactional
    void rls_is_enforced_by_database_setting() {
        String artifactId = given()
            .contentType(ContentType.JSON)
            .body("{\"type\":\"PROCESS\",\"title\":\"Tenant B Process\"}")
            .when()
            .post("/api/tenants/" + TENANT_B + "/artifacts")
            .then()
            .statusCode(201)
            .extract().path("id");

        UUID id = UUID.fromString(artifactId);

        em.createNativeQuery("SELECT set_config('app.current_tenant', :tid, true)")
            .setParameter("tid", TENANT_A.toString())
            .getSingleResult();

        Number countA = (Number) em.createNativeQuery("SELECT COUNT(*) FROM artifact WHERE id = :id")
            .setParameter("id", id)
            .getSingleResult();
        assertEquals(0L, countA.longValue());

        em.createNativeQuery("SELECT set_config('app.current_tenant', :tid, true)")
            .setParameter("tid", TENANT_B.toString())
            .getSingleResult();

        Number countB = (Number) em.createNativeQuery("SELECT COUNT(*) FROM artifact WHERE id = :id")
            .setParameter("id", id)
            .getSingleResult();
        assertEquals(1L, countB.longValue());
    }
}
