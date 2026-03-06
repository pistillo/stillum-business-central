-- Unify payload_ref and source_ref into a single source_ref column.
-- All artifact content references now use source_ref exclusively.
-- Also drop legacy columns that have been migrated to MinIO.

-- 1. Copy payload_ref values into source_ref where not yet set
UPDATE artifact_version
   SET source_ref = payload_ref
 WHERE payload_ref IS NOT NULL
   AND source_ref IS NULL;

-- 2. Drop legacy and deprecated columns
ALTER TABLE artifact_version DROP COLUMN IF EXISTS payload_ref;
ALTER TABLE artifact_version DROP COLUMN IF EXISTS source_code;
ALTER TABLE artifact_version DROP COLUMN IF EXISTS source_files;
ALTER TABLE artifact_version DROP COLUMN IF EXISTS build_snapshot;
ALTER TABLE artifact_version DROP COLUMN IF EXISTS npm_dependencies;
