package com.stillum.registry.resource;

import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import java.util.UUID;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.empty;
import static org.hamcrest.Matchers.everyItem;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.notNullValue;

@QuarkusTest
class SearchResourceTest {

    static final String TENANT_ID = "00000000-0000-0000-0000-000000000001";
    static final String TENANT_B  = "00000000-0000-0000-0000-000000000002";
    static final String SEARCH_PATH   = "/api/tenants/" + TENANT_ID + "/search/artifacts";
    static final String ARTIFACTS_PATH = "/api/tenants/" + TENANT_ID + "/artifacts";

    @Test
    void search_byQuery_returnsFtsMatches() {
        String tag = uniqueTag("srt_fts");
        createArtifact("PROCESS", "SRT_FTS_Invoice Processing Workflow",
                "automated invoice handling and approval", "Finance", tag);

        createArtifact("RULE", "SRT_FTS_Employee Leave Policy",
                "rules for leave management", "HR", tag);

        given()
            .queryParam("q", "invoice")
        .when()
            .get(SEARCH_PATH)
        .then()
            .statusCode(200)
            .body("items", not(empty()))
            .body("items.title", hasItem("SRT_FTS_Invoice Processing Workflow"));
    }

    @Test
    void search_byTag_returnsTaggedArtifacts() {
        String tagFinance = uniqueTag("srt_tag_finance");
        createArtifact("PROCESS", "SRT_Tag_Finance Process",
                null, null, tagFinance, "automation");

        String tagHr = uniqueTag("srt_tag_hr");
        createArtifact("RULE", "SRT_Tag_HR Rule",
                null, null, tagHr);

        given()
            .queryParam("tag", tagFinance)
        .when()
            .get(SEARCH_PATH)
        .then()
            .statusCode(200)
            .body("items", not(empty()))
            .body("items.tags", everyItem(hasItem(tagFinance)));
    }

    @Test
    void search_byType_returnsFiltered() {
        String tag = uniqueTag("srt_type");
        createArtifact("FORM", "SRT_Type_Registration Form",
                null, null, tag);

        createArtifact("RULE", "SRT_Type_Validation Rule",
                null, null, tag);

        given()
            .queryParam("tag", tag)
            .queryParam("type", "FORM")
        .when()
            .get(SEARCH_PATH)
        .then()
            .statusCode(200)
            .body("items", not(empty()))
            .body("items.type", everyItem(is("FORM")));
    }

    @Test
    void search_byStatus_returnsFiltered() {
        String tag = uniqueTag("srt_status");
        createArtifact("PROCESS", "SRT_Status_Draft Process",
                null, null, tag);

        given()
            .queryParam("tag", tag)
            .queryParam("status", "DRAFT")
        .when()
            .get(SEARCH_PATH)
        .then()
            .statusCode(200)
            .body("items", not(empty()))
            .body("items.status", everyItem(is("DRAFT")));

        given()
            .queryParam("tag", tag)
            .queryParam("status", "PUBLISHED")
        .when()
            .get(SEARCH_PATH)
        .then()
            .statusCode(200)
            .body("items", empty())
            .body("total", is(0));
    }

    @Test
    void search_combinedFilters_returnsIntersection() {
        String tag = uniqueTag("srt_combined_compliance");
        createArtifact("PROCESS", "SRT_Combined_Compliance Process Alpha",
                "compliance workflow", "Legal", tag);

        createArtifact("RULE", "SRT_Combined_Compliance Rule Beta",
                "compliance rule", "Legal", tag);

        createArtifact("PROCESS", "SRT_Combined_HR Process Gamma",
                "hr workflow", "HR", uniqueTag("srt_combined_hr"));

        given()
            .queryParam("q", "compliance")
            .queryParam("type", "PROCESS")
            .queryParam("tag", tag)
        .when()
            .get(SEARCH_PATH)
        .then()
            .statusCode(200)
            .body("items", hasSize(1))
            .body("items[0].title", is("SRT_Combined_Compliance Process Alpha"));
    }

    @Test
    void search_noResults_returnsEmptyPage() {
        given()
            .queryParam("q", "srt_nonexistent_zzz_999")
        .when()
            .get(SEARCH_PATH)
        .then()
            .statusCode(200)
            .body("items", empty())
            .body("total", is(0));
    }

    @Test
    void search_pagination_works() {
        String tag = uniqueTag("srt_pagination");
        for (int i = 1; i <= 3; i++) {
            createArtifact("PROCESS", "SRT_Pag_Process " + i,
                    null, null, tag);
        }

        given()
            .queryParam("tag", tag)
            .queryParam("page", 0)
            .queryParam("size", 2)
        .when()
            .get(SEARCH_PATH)
        .then()
            .statusCode(200)
            .body("items", hasSize(2))
            .body("page", is(0))
            .body("pageSize", is(2))
            .body("total", is(3));

        given()
            .queryParam("tag", tag)
            .queryParam("page", 1)
            .queryParam("size", 2)
        .when()
            .get(SEARCH_PATH)
        .then()
            .statusCode(200)
            .body("items", hasSize(1))
            .body("page", is(1));
    }

    @Test
    void search_noParams_returnsAll() {
        given()
        .when()
            .get(SEARCH_PATH)
        .then()
            .statusCode(200)
            .body("items", not(empty()))
            .body("page", is(0))
            .body("items", notNullValue());
    }

    @Test
    void search_tenantIsolation_otherTenantNotVisible() {
        String tag = uniqueTag("srt_isolation");
        createArtifact("PROCESS", "SRT_Isolation_Secret Process",
                null, null, tag);

        String searchPathB = "/api/tenants/" + TENANT_B + "/search/artifacts";
        given()
            .queryParam("tag", tag)
        .when()
            .get(searchPathB)
        .then()
            .statusCode(200)
            .body("items", empty())
            .body("total", is(0));
    }

    private static String uniqueTag(String base) {
        return base + "_" + UUID.randomUUID();
    }

    private String createArtifact(String type, String title, String description,
                                   String area, String... tags) {
        StringBuilder json = new StringBuilder();
        json.append("{\"type\":\"").append(type).append("\",");
        json.append("\"title\":\"").append(title).append("\"");
        if (description != null) {
            json.append(",\"description\":\"").append(description).append("\"");
        }
        if (area != null) {
            json.append(",\"area\":\"").append(area).append("\"");
        }
        if (tags.length > 0) {
            json.append(",\"tags\":[");
            for (int i = 0; i < tags.length; i++) {
                if (i > 0) json.append(",");
                json.append("\"").append(tags[i]).append("\"");
            }
            json.append("]");
        }
        json.append("}");

        return given()
            .contentType(ContentType.JSON)
            .body(json.toString())
        .when()
            .post(ARTIFACTS_PATH)
        .then()
            .statusCode(201)
            .extract().path("id");
    }
}
