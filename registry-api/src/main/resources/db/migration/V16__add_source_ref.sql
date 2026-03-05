-- Add source_ref column to artifact_version.
-- Points to the MinIO S3 object key that holds sourceCode + sourceFiles + buildSnapshot.
-- Old columns (source_code, source_files, build_snapshot) are kept for backward
-- compatibility until the data migrator moves existing data to MinIO.
ALTER TABLE artifact_version
    ADD COLUMN source_ref VARCHAR(500);
