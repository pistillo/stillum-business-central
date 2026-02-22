package com.stillum.publisher.service;

import jakarta.enterprise.context.ApplicationScoped;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@ApplicationScoped
public class BundleService {

    public static class BundleManifest {
        public String artifactId;
        public String versionId;
        public String type;
        public String hash;
        public LocalDateTime timestamp;
        public List<String> dependencies;

        public BundleManifest(String artifactId, String versionId, String type) {
            this.artifactId = artifactId;
            this.versionId = versionId;
            this.type = type;
            this.timestamp = LocalDateTime.now();
            this.dependencies = new ArrayList<>();
        }
    }

    public byte[] createBundle(String artifactId, String versionId, String type, 
                              byte[] payload, List<String> dependencies) throws Exception {
        BundleManifest manifest = new BundleManifest(artifactId, versionId, type);
        if (dependencies != null) {
            manifest.dependencies.addAll(dependencies);
        }

        // Calculate hash of payload
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        String payloadHash = Base64.getEncoder().encodeToString(digest.digest(payload));
        manifest.hash = payloadHash;

        return createZipBundle(manifest, payload);
    }

    private byte[] createZipBundle(BundleManifest manifest, byte[] payload) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try (ZipOutputStream zos = new ZipOutputStream(baos)) {
            // Add manifest
            ZipEntry manifestEntry = new ZipEntry("manifest.json");
            zos.putNextEntry(manifestEntry);
            String manifestJson = generateManifestJson(manifest);
            zos.write(manifestJson.getBytes(StandardCharsets.UTF_8));
            zos.closeEntry();

            // Add payload
            ZipEntry payloadEntry = new ZipEntry("payload.bin");
            zos.putNextEntry(payloadEntry);
            zos.write(payload);
            zos.closeEntry();
        }

        return baos.toByteArray();
    }

    private String generateManifestJson(BundleManifest manifest) {
        StringBuilder json = new StringBuilder();
        json.append("{\n");
        json.append("  \"artifactId\": \"").append(manifest.artifactId).append("\",\n");
        json.append("  \"versionId\": \"").append(manifest.versionId).append("\",\n");
        json.append("  \"type\": \"").append(manifest.type).append("\",\n");
        json.append("  \"hash\": \"").append(manifest.hash).append("\",\n");
        json.append("  \"timestamp\": \"").append(manifest.timestamp.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)).append("\",\n");
        json.append("  \"dependencies\": [");

        for (int i = 0; i < manifest.dependencies.size(); i++) {
            if (i > 0) json.append(", ");
            json.append("\"").append(manifest.dependencies.get(i)).append("\"");
        }

        json.append("]\n");
        json.append("}\n");

        return json.toString();
    }
}
