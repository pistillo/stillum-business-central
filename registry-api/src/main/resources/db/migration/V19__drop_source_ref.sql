-- source_ref non serve più: i file sono sotto il prefix S3 convenzionale
ALTER TABLE artifact_version DROP COLUMN IF EXISTS source_ref;
