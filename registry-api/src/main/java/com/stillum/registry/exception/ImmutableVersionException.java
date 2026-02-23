package com.stillum.registry.exception;

import java.util.UUID;

public class ImmutableVersionException extends RuntimeException {

    public ImmutableVersionException(UUID versionId) {
        super("Version " + versionId + " is published and cannot be modified or deleted");
    }
}
