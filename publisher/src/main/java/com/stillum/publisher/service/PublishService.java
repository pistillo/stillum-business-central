package com.stillum.publisher.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.stillum.publisher.dto.request.PublishRequest;
import com.stillum.publisher.dto.response.PublicationResponse;
import com.stillum.publisher.entity.Artifact;
import com.stillum.publisher.entity.ArtifactVersion;
import com.stillum.publisher.entity.Dependency;
import com.stillum.publisher.entity.Environment;
import com.stillum.publisher.entity.Publication;
import com.stillum.publisher.exception.ConflictException;
import com.stillum.publisher.exception.NotFoundException;
import com.stillum.publisher.filter.EnforceTenantRls;
import com.stillum.publisher.repository.ArtifactRepository;
import com.stillum.publisher.repository.ArtifactVersionRepository;
import com.stillum.publisher.repository.DependencyRepository;
import com.stillum.publisher.repository.EnvironmentRepository;
import com.stillum.publisher.repository.PublicationRepository;
import com.stillum.publisher.storage.S3StorageClient;
import com.stillum.publisher.storage.StoragePathBuilder;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import java.io.ByteArrayOutputStream;
import java.security.MessageDigest;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.HexFormat;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;
import javax.xml.XMLConstants;
import javax.xml.parsers.DocumentBuilderFactory;

@ApplicationScoped
@EnforceTenantRls
public class PublishService {

    @Inject
    ArtifactRepository artifactRepo;

    @Inject
    ArtifactVersionRepository versionRepo;

    @Inject
    DependencyRepository dependencyRepo;

    @Inject
    EnvironmentRepository envRepo;

    @Inject
    PublicationRepository publicationRepo;

    @Inject
    AuditService audit;

    @Inject
    S3StorageClient s3;

    @Inject
    ObjectMapper mapper;

    @Inject
    EntityManager em;

    @Transactional
    public PublicationResponse publish(UUID tenantId, PublishRequest req) {
        try {
            Environment env = envRepo.findByIdAndTenant(req.environmentId(), tenantId)
                    .orElseThrow(() -> new NotFoundException("Environment not found: " + req.environmentId()));

            Artifact artifact = artifactRepo.findByIdAndTenant(req.artifactId(), tenantId)
                    .orElseThrow(() -> new NotFoundException("Artifact not found: " + req.artifactId()));

            ArtifactVersion version = versionRepo.findByIdAndArtifact(req.versionId(), req.artifactId())
                    .orElseThrow(() -> new NotFoundException("Version not found: " + req.versionId()));

            if ("PROD".equalsIgnoreCase(env.name) && !"APPROVED".equalsIgnoreCase(version.state)) {
                throw new ConflictException("Cannot publish to PROD unless version is APPROVED: " + version.id);
            }

            if ("PUBLISHED".equalsIgnoreCase(version.state)) {
                throw new ConflictException("Version is already published: " + version.id);
            }

            if (version.payloadRef == null || version.payloadRef.isBlank()) {
                throw new ConflictException("Version has no payloadRef: " + version.id);
            }

            String bundleKey = StoragePathBuilder.bundleKey(tenantId, artifact.type, artifact.id, version.id);
            if (s3.exists(s3.getBundlesBucket(), bundleKey)) {
                throw new ConflictException("Bundle already exists: " + bundleKey);
            }

            List<BundleFile> files = new ArrayList<>();
            String rootExt = StoragePathBuilder.extensionFor(artifact.type);
            byte[] rootBytes = s3.downloadBytes(s3.getArtifactsBucket(), version.payloadRef);
            validatePayload(artifact.type, rootBytes);
            files.add(new BundleFile(
                    "artifact/" + artifact.id + "/" + version.id + "." + rootExt,
                    artifact.id,
                    version.id,
                    artifact.type,
                    version.payloadRef,
                    rootBytes
            ));

            List<Dependency> deps = dependencyRepo.findByVersion(version.id);
            for (Dependency dep : deps) {
                Artifact depArtifact = artifactRepo.findByIdAndTenant(dep.dependsOnArtifactId, tenantId)
                        .orElseThrow(() -> new NotFoundException(
                                "Dependency artifact not found: " + dep.dependsOnArtifactId));

                ArtifactVersion depVersion = versionRepo
                        .findByIdAndArtifact(dep.dependsOnVersionId, dep.dependsOnArtifactId)
                        .orElseThrow(() -> new NotFoundException(
                                "Dependency version not found: " + dep.dependsOnVersionId));

                if (!"PUBLISHED".equalsIgnoreCase(depVersion.state)) {
                    throw new ConflictException("Dependency version not published: " + depVersion.id);
                }
                if (depVersion.payloadRef == null || depVersion.payloadRef.isBlank()) {
                    throw new ConflictException("Dependency has no payloadRef: " + depVersion.id);
                }

                String ext = StoragePathBuilder.extensionFor(depArtifact.type);
                byte[] bytes = s3.downloadBytes(s3.getArtifactsBucket(), depVersion.payloadRef);
                validatePayload(depArtifact.type, bytes);
                files.add(new BundleFile(
                        "dependency/" + depArtifact.id + "/" + depVersion.id + "." + ext,
                        depArtifact.id,
                        depVersion.id,
                        depArtifact.type,
                        depVersion.payloadRef,
                        bytes
                ));
            }

            byte[] bundle = buildBundle(tenantId, artifact, version, req, files);
            s3.uploadBytes(s3.getBundlesBucket(), bundleKey, bundle, "application/zip");

            Publication pub = new Publication();
            pub.artifactVersionId = version.id;
            pub.environmentId = req.environmentId();
            pub.publishedAt = OffsetDateTime.now();
            pub.notes = req.notes();
            pub.bundleRef = bundleKey;
            publicationRepo.persist(pub);

            version.state = "PUBLISHED";

            audit.publishSuccess(tenantId, pub.id, artifact.id, version.id, req.environmentId(), bundleKey);
            return new PublicationResponse(
                    pub.id,
                    tenantId,
                    artifact.id,
                    version.id,
                    req.environmentId(),
                    pub.publishedAt,
                    bundleKey,
                    pub.notes
            );
        } catch (RuntimeException e) {
            audit.publishFailure(tenantId, req.artifactId(), req.versionId(), req.environmentId(), e.getMessage());
            throw e;
        }
    }

    @Transactional
    public PublicationResponse getPublication(UUID tenantId, UUID publicationId) {
        Publication pub = publicationRepo.findByIdOptional(publicationId)
                .orElseThrow(() -> new NotFoundException("Publication not found: " + publicationId));

        envRepo.findByIdAndTenant(pub.environmentId, tenantId)
                .orElseThrow(() -> new NotFoundException("Publication not found: " + publicationId));

        UUID artifactId = (UUID) em.createNativeQuery(
                        "SELECT a.id FROM publication p " +
                                "JOIN artifact_version av ON av.id = p.artifact_version_id " +
                                "JOIN artifact a ON a.id = av.artifact_id " +
                                "WHERE p.id = :pid")
                .setParameter("pid", publicationId)
                .getSingleResult();

        return new PublicationResponse(
                pub.id,
                tenantId,
                artifactId,
                pub.artifactVersionId,
                pub.environmentId,
                pub.publishedAt,
                pub.bundleRef,
                pub.notes
        );
    }

    private byte[] buildBundle(
            UUID tenantId,
            Artifact artifact,
            ArtifactVersion version,
            PublishRequest req,
            List<BundleFile> files) {
        try {
            List<Map<String, Object>> fileEntries = files.stream()
                    .map(f -> Map.<String, Object>of(
                            "path", f.path(),
                            "artifactId", f.artifactId(),
                            "versionId", f.versionId(),
                            "type", f.type(),
                            "payloadRef", f.payloadRef(),
                            "sha256", sha256Hex(f.bytes())
                    ))
                    .toList();

            Map<String, Object> manifest = Map.of(
                    "tenantId", tenantId,
                    "artifactId", artifact.id,
                    "versionId", version.id,
                    "type", artifact.type,
                    "environmentId", req.environmentId(),
                    "publishedAt", OffsetDateTime.now().toString(),
                    "files", fileEntries
            );
            byte[] manifestBytes = mapper.writeValueAsBytes(manifest);

            ByteArrayOutputStream bos = new ByteArrayOutputStream();
            try (ZipOutputStream zip = new ZipOutputStream(bos)) {
                zip.putNextEntry(new ZipEntry("manifest.json"));
                zip.write(manifestBytes);
                zip.closeEntry();

                for (BundleFile f : files) {
                    zip.putNextEntry(new ZipEntry(f.path()));
                    zip.write(f.bytes());
                    zip.closeEntry();
                }
            }
            return bos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private void validatePayload(String artifactType, byte[] bytes) {
        String ext = StoragePathBuilder.extensionFor(artifactType);
        if ("xml".equals(ext)) {
            validateXml(bytes);
            return;
        }
        if ("json".equals(ext)) {
            validateJson(bytes);
        }
    }

    private void validateJson(byte[] bytes) {
        try {
            mapper.readTree(bytes);
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid JSON payload");
        }
    }

    private void validateXml(byte[] bytes) {
        try {
            DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
            dbf.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
            dbf.setFeature("http://xml.org/sax/features/external-general-entities", false);
            dbf.setFeature("http://xml.org/sax/features/external-parameter-entities", false);
            dbf.setFeature(XMLConstants.FEATURE_SECURE_PROCESSING, true);
            dbf.setXIncludeAware(false);
            dbf.setExpandEntityReferences(false);
            dbf.newDocumentBuilder().parse(new java.io.ByteArrayInputStream(bytes));
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid XML payload");
        }
    }

    private String sha256Hex(byte[] bytes) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] digest = md.digest(bytes);
            return HexFormat.of().formatHex(digest);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private record BundleFile(
            String path,
            UUID artifactId,
            UUID versionId,
            String type,
            String payloadRef,
            byte[] bytes
    ) {
    }
}
