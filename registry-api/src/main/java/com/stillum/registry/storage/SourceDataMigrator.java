package com.stillum.registry.storage;

import com.stillum.registry.entity.Artifact;
import com.stillum.registry.entity.ArtifactVersion;
import io.quarkus.runtime.StartupEvent;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import java.util.List;
import org.jboss.logging.Logger;

/**
 * One-time migrator that moves sourceCode, sourceFiles, and buildSnapshot
 * from the artifact_version table (PostgreSQL) to MinIO.
 * Runs on application startup. Idempotent: skips versions that already
 * have a sourceRef set.
 */
@ApplicationScoped
public class SourceDataMigrator {

    private static final Logger LOG = Logger.getLogger(SourceDataMigrator.class);

    @Inject
    SourceStorageService sourceStorage;

    @Inject
    EntityManager em;

    @Transactional
    void onStart(@Observes StartupEvent event) {
        LOG.info("[SourceDataMigrator] Checking for legacy source data to migrate...");

        // Find all versions that have inline source data but no sourceRef yet
        @SuppressWarnings("unchecked")
        List<ArtifactVersion> candidates = em.createQuery(
                        "SELECT v FROM ArtifactVersion v WHERE v.sourceRef IS NULL " +
                        "AND (v.sourceCode IS NOT NULL OR v.sourceFiles IS NOT NULL OR v.buildSnapshot IS NOT NULL)")
                .getResultList();

        if (candidates.isEmpty()) {
            LOG.info("[SourceDataMigrator] No legacy data to migrate.");
            return;
        }

        LOG.infof("[SourceDataMigrator] Found %d version(s) to migrate.", candidates.size());
        int migrated = 0;

        for (ArtifactVersion v : candidates) {
            try {
                // Look up the tenant ID from the parent artifact
                Artifact artifact = em.find(Artifact.class, v.artifactId);
                if (artifact == null) {
                    LOG.warnf("[SourceDataMigrator] Artifact %s not found for version %s, skipping.",
                            v.artifactId, v.id);
                    continue;
                }

                // Upload to MinIO
                String sourceRef = sourceStorage.save(
                        artifact.tenantId, v.artifactId, v.id,
                        v.sourceCode, v.sourceFiles, v.buildSnapshot);

                // Update the version entity
                v.sourceRef = sourceRef;

                // Clear legacy columns
                v.sourceCode = null;
                v.sourceFiles = null;
                v.buildSnapshot = null;

                migrated++;
            } catch (Exception e) {
                LOG.errorf(e, "[SourceDataMigrator] Failed to migrate version %s, skipping.", v.id);
            }
        }

        LOG.infof("[SourceDataMigrator] Migration complete: %d/%d versions migrated to MinIO.",
                migrated, candidates.size());
    }
}
