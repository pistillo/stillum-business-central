package com.stillum.publisher.client;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class NpmArtifactTypeTest {

    @Test
    void from_acceptsModuleAndComponent_caseInsensitive() {
        assertEquals(NpmArtifactType.MODULE, NpmArtifactType.from("MODULE"));
        assertEquals(NpmArtifactType.MODULE, NpmArtifactType.from("module"));
        assertEquals(NpmArtifactType.COMPONENT, NpmArtifactType.from("COMPONENT"));
        assertEquals(NpmArtifactType.COMPONENT, NpmArtifactType.from("component"));
    }

    @Test
    void from_rejectsNullBlankAndUnknown() {
        assertThrows(IllegalArgumentException.class, () -> NpmArtifactType.from(null));
        assertThrows(IllegalArgumentException.class, () -> NpmArtifactType.from(""));
        assertThrows(IllegalArgumentException.class, () -> NpmArtifactType.from("FORM"));
    }
}
