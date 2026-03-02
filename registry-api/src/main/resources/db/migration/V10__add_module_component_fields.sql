-- V10: Aggiunta campi per artefatti MODULE e COMPONENT su artifact_version

ALTER TABLE artifact_version
    ADD COLUMN source_code TEXT;

ALTER TABLE artifact_version
    ADD COLUMN npm_dependencies JSONB;

ALTER TABLE artifact_version
    ADD COLUMN npm_package_ref VARCHAR(500);
-- NB: Le colonne potrebbero gia' esistere se il registry-api ha migrato per primo.

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'artifact_version' AND column_name = 'source_code'
    ) THEN
        ALTER TABLE artifact_version ADD COLUMN source_code TEXT;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'artifact_version' AND column_name = 'npm_dependencies'
    ) THEN
        ALTER TABLE artifact_version ADD COLUMN npm_dependencies JSONB;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'artifact_version' AND column_name = 'npm_package_ref'
    ) THEN
        ALTER TABLE artifact_version ADD COLUMN npm_package_ref VARCHAR(500);
    END IF;
END
$$;
