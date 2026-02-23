package com.stillum.registry.exception;

import java.util.UUID;

public class EnvironmentNotFoundException extends RuntimeException {
    public EnvironmentNotFoundException(UUID environmentId) {
        super("Environment not found: " + environmentId);
    }
}
