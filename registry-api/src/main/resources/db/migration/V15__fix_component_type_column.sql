-- Fix component_type column: convert from PostgreSQL native enum to VARCHAR
-- so Hibernate @Enumerated(EnumType.STRING) works without custom type mapping.
-- This is safe to run whether the column was created as native enum or VARCHAR.
DO $$
BEGIN
    -- Check if the column uses the native enum type
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'artifact'
        AND column_name = 'component_type'
        AND udt_name = 'component_type'
    ) THEN
        -- Convert column from native enum to VARCHAR
        ALTER TABLE artifact
            ALTER COLUMN component_type TYPE VARCHAR(20)
            USING component_type::text;
        -- Drop the native enum type
        DROP TYPE IF EXISTS component_type;
    END IF;
END $$;
