-- V10: Aggiunta campi per artefatti MODULE e COMPONENT su artifact_version

ALTER TABLE artifact_version
    ADD COLUMN source_code TEXT;

ALTER TABLE artifact_version
    ADD COLUMN npm_dependencies JSONB;

ALTER TABLE artifact_version
    ADD COLUMN npm_package_ref VARCHAR(500);
