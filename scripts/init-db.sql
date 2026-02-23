-- Stillum Business Portal – init PostgreSQL
-- Eseguito al primo avvio del container (docker-entrypoint-initdb.d)
-- Le tabelle applicative sono create da Flyway in registry-api (EPIC 1)

SET client_encoding = 'UTF8';

-- Estensioni utili (UUID, ecc.)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Database stillumdb è già creato via POSTGRES_DB; qui solo estensioni/default
-- Nessuna tabella: Flyway in registry-api gestirà lo schema.
