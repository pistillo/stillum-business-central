package com.stillum.registry.entity;

import java.time.OffsetDateTime;
import java.util.Map;

/**
 * Snapshot congelato dei file di compilazione associato a una versione del modulo.
 * Include il template di origine, i parametri di input e i contenuti risolti.
 * Una volta pubblicata la versione, lo snapshot resta immutabile.
 */
public record BuildSnapshot(
        OffsetDateTime generatedAt,
        String templateVersion,
        Map<String, String> inputs,
        Map<String, String> files
) {
}
