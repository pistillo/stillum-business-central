package com.stillum.registry.exception;

public class ObjectAlreadyExistsException extends RuntimeException {

    public ObjectAlreadyExistsException(String key) {
        super("Object already exists: " + key);
    }
}

