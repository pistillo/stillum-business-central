-- Drop component_type column — area is used instead.
ALTER TABLE artifact DROP COLUMN IF EXISTS component_type;
DROP TYPE IF EXISTS component_type;
