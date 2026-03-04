-- Add component_type column to artifact table
-- Used to distinguish DROPLET, POOL, TRIGGER subtypes of COMPONENT artifacts.
-- The value also determines the folder under src/components/ in the workspace.
CREATE TYPE component_type AS ENUM ('DROPLET', 'POOL', 'TRIGGER');

ALTER TABLE artifact
    ADD COLUMN component_type component_type;
