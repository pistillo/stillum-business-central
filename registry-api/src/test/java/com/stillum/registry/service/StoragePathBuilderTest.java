package com.stillum.registry.service;

import com.stillum.registry.storage.StoragePathBuilder;
import java.util.UUID;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class StoragePathBuilderTest {

    private static final UUID TENANT = UUID.fromString("00000000-0000-0000-0000-000000000001");
    private static final UUID ARTIFACT = UUID.fromString("aaaaaaaa-0000-0000-0000-000000000001");
    private static final UUID VERSION = UUID.fromString("bbbbbbbb-0000-0000-0000-000000000001");

    @Test
    void artifactKey_process_producesXmlPath() {
        String key = StoragePathBuilder.artifactKey(TENANT, "PROCESS", ARTIFACT, VERSION, "xml");
        assertEquals(
            "tenant-00000000-0000-0000-0000-000000000001/artifacts/process/"
            + "aaaaaaaa-0000-0000-0000-000000000001/"
            + "bbbbbbbb-0000-0000-0000-000000000001.xml",
            key
        );
    }

    @Test
    void bundleKey_containsTenantPrefix() {
        String key = StoragePathBuilder.bundleKey(TENANT, "RULE", ARTIFACT, VERSION);
        assertTrue(key.startsWith("tenant-" + TENANT));
        assertTrue(key.endsWith(".zip"));
        assertTrue(key.contains("/bundles/rule/"));
    }

    @Test
    void extensionFor_processAndRule_returnsXml() {
        assertEquals("xml", StoragePathBuilder.extensionFor("PROCESS"));
        assertEquals("xml", StoragePathBuilder.extensionFor("RULE"));
    }

    @Test
    void extensionFor_formAndRequest_returnsJson() {
        assertEquals("json", StoragePathBuilder.extensionFor("FORM"));
        assertEquals("json", StoragePathBuilder.extensionFor("REQUEST"));
    }
}
