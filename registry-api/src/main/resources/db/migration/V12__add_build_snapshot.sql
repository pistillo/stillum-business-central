-- V12: Aggiunta build_snapshot su artifact_version per conservare lo snapshot
-- dei file di configurazione (package.json, tsconfig.json, webpack.config.js, ecc.)
-- associato a ogni versione del modulo, garantendo build riproducibili e auditabili.

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'artifact_version' AND column_name = 'build_snapshot'
    ) THEN
        ALTER TABLE artifact_version ADD COLUMN build_snapshot JSONB;
        COMMENT ON COLUMN artifact_version.build_snapshot IS
            'Snapshot congelato dei file di compilazione: template di origine, parametri di input e contenuti risolti';
    END IF;
END
$$;
