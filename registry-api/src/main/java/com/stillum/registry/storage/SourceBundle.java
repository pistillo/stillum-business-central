package com.stillum.registry.storage;

import com.stillum.registry.entity.BuildSnapshot;
import java.util.Map;

/**
 * Holds all source-related data for an artifact version.
 * This is serialised as a single JSON object and stored in MinIO.
 */
public record SourceBundle(
        String sourceCode,
        Map<String, String> sourceFiles,
        BuildSnapshot buildSnapshot
) {

    /** An empty bundle (no source data). */
    public static final SourceBundle EMPTY = new SourceBundle(null, null, null);

    /** Returns true if this bundle has no content at all. */
    public boolean isEmpty() {
        return sourceCode == null
                && (sourceFiles == null || sourceFiles.isEmpty())
                && buildSnapshot == null;
    }
}
