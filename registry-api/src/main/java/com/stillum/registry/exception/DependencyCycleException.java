package com.stillum.registry.exception;

import java.util.UUID;

public class DependencyCycleException extends RuntimeException {

    public DependencyCycleException(UUID versionId) {
        super("Adding dependency would create a cycle involving version: " + versionId);
    }
}
