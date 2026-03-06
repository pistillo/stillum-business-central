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
    void versionPrefix_producesCorrectPath() {
        String prefix = StoragePathBuilder.versionPrefix(TENANT, "PROCESS", ARTIFACT, VERSION);
        assertEquals(
            "tenant-00000000-0000-0000-0000-000000000001/process/"
            + "aaaaaaaa-0000-0000-0000-000000000001/"
            + "bbbbbbbb-0000-0000-0000-000000000001/",
            prefix
        );
    }

    @Test
    void fileKey_producesCorrectPath() {
        String key = StoragePathBuilder.fileKey(TENANT, "MODULE", ARTIFACT, VERSION, "src/index.tsx");
        assertEquals(
            "tenant-00000000-0000-0000-0000-000000000001/module/"
            + "aaaaaaaa-0000-0000-0000-000000000001/"
            + "bbbbbbbb-0000-0000-0000-000000000001/src/index.tsx",
            key
        );
    }

    @Test
    void defaultFileName_returnsCorrectNames() {
        assertEquals("process.bpmn", StoragePathBuilder.defaultFileName("PROCESS"));
        assertEquals("rule.dmn", StoragePathBuilder.defaultFileName("RULE"));
        assertEquals("form.json", StoragePathBuilder.defaultFileName("FORM"));
        assertEquals("request.json", StoragePathBuilder.defaultFileName("REQUEST"));
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

    @Test
    void extensionFor_moduleAndComponent_returnsTsx() {
        assertEquals("tsx", StoragePathBuilder.extensionFor("MODULE"));
        assertEquals("tsx", StoragePathBuilder.extensionFor("COMPONENT"));
    }

    @Test
    void isSourceCodeBased_moduleAndComponent_returnsTrue() {
        assertTrue(StoragePathBuilder.isSourceCodeBased("MODULE"));
        assertTrue(StoragePathBuilder.isSourceCodeBased("COMPONENT"));
    }
}
